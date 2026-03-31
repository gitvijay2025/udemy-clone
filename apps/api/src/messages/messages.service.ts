import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ComposeMessageDto, ReplyMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly db: DatabaseService) {}

  /** Compose a new top-level message */
  async compose(senderId: string, senderRole: string, dto: ComposeMessageDto) {
    const receiver = await this.db.queryOne<any>(
      'SELECT id, name, role FROM User WHERE id = ?',
      [dto.receiverId],
    );
    if (!receiver) throw new NotFoundException('Receiver not found');

    // Students can only message instructors whose courses they have purchased
    if (senderRole === 'STUDENT' && receiver.role === 'INSTRUCTOR') {
      const enrollment = await this.db.queryOne<any>(
        `SELECT e.id FROM Enrollment e
         JOIN Course c ON e.courseId = c.id
         WHERE e.userId = ? AND c.instructorId = ?
         LIMIT 1`,
        [senderId, dto.receiverId],
      );
      if (!enrollment) {
        throw new ForbiddenException(
          'You must be enrolled in one of this instructor\'s courses to send a message.',
        );
      }
    }

    const result = await this.db.execute(
      `INSERT INTO Message (senderId, receiverId, subject, content, createdAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [senderId, dto.receiverId, dto.subject, dto.content],
    );

    // Create notification
    const sender = await this.db.queryOne<any>('SELECT name FROM User WHERE id = ?', [senderId]);
    await this.db.execute(
      `INSERT INTO Notification (userId, type, title, message, link, createdAt)
       VALUES (?, 'MESSAGE', 'New Message', ?, '/messages', NOW())`,
      [dto.receiverId, `New message from ${sender?.name ?? 'Someone'}: ${dto.subject}`],
    );

    return this.formatMessage(
      await this.db.queryOne<any>(
        `SELECT m.*, s.name as sName, s.avatarUrl as sAvatar, r.name as rName, r.avatarUrl as rAvatar
         FROM Message m JOIN User s ON m.senderId = s.id JOIN User r ON m.receiverId = r.id
         WHERE m.id = ?`,
        [result.insertId],
      ),
    );
  }

  /** Reply to an existing message */
  async reply(senderId: string, messageId: string, dto: ReplyMessageDto) {
    // Find the root message (follow parentId chain to the top)
    const original = await this.db.queryOne<any>('SELECT * FROM Message WHERE id = ?', [messageId]);
    if (!original) throw new NotFoundException('Message not found');

    // Determine the root of the thread
    const rootId = original.parentId ?? original.id;
    const root = original.parentId
      ? await this.db.queryOne<any>('SELECT * FROM Message WHERE id = ?', [rootId])
      : original;
    if (!root) throw new NotFoundException('Original message not found');

    // Ensure the user is part of this conversation
    const sId = Number(senderId);
    if (sId !== Number(root.senderId) && sId !== Number(root.receiverId)) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    // The receiver is the other person in the original message
    const receiverId = sId === Number(root.senderId) ? root.receiverId : root.senderId;

    const result = await this.db.execute(
      `INSERT INTO Message (senderId, receiverId, subject, parentId, content, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [senderId, receiverId, root.subject ? `Re: ${root.subject.replace(/^(Re: )+/, '')}` : null, rootId, dto.content],
    );

    // Create notification
    const sender = await this.db.queryOne<any>('SELECT name FROM User WHERE id = ?', [senderId]);
    await this.db.execute(
      `INSERT INTO Notification (userId, type, title, message, link, createdAt)
       VALUES (?, 'MESSAGE', 'New Reply', ?, '/messages', NOW())`,
      [receiverId, `${sender?.name ?? 'Someone'} replied to: ${root.subject ?? 'your message'}`],
    );

    return this.formatMessage(
      await this.db.queryOne<any>(
        `SELECT m.*, s.name as sName, s.avatarUrl as sAvatar, r.name as rName, r.avatarUrl as rAvatar
         FROM Message m JOIN User s ON m.senderId = s.id JOIN User r ON m.receiverId = r.id
         WHERE m.id = ?`,
        [result.insertId],
      ),
    );
  }

  /** Inbox — top-level messages received by this user, ordered newest first */
  async getInbox(userId: string) {
    const messages = await this.db.query<any>(
      `SELECT m.*, s.name as sName, s.avatarUrl as sAvatar, r.name as rName, r.avatarUrl as rAvatar,
              (SELECT COUNT(*) FROM Message c WHERE c.parentId = m.id) as replyCount
       FROM Message m
       JOIN User s ON m.senderId = s.id
       JOIN User r ON m.receiverId = r.id
       WHERE m.receiverId = ? AND m.parentId IS NULL
       ORDER BY m.createdAt DESC`,
      [userId],
    );
    return messages.map((m: any) => this.formatMessageSummary(m));
  }

  /** Sent — top-level messages sent by this user, ordered newest first */
  async getSent(userId: string) {
    const messages = await this.db.query<any>(
      `SELECT m.*, s.name as sName, s.avatarUrl as sAvatar, r.name as rName, r.avatarUrl as rAvatar,
              (SELECT COUNT(*) FROM Message c WHERE c.parentId = m.id) as replyCount
       FROM Message m
       JOIN User s ON m.senderId = s.id
       JOIN User r ON m.receiverId = r.id
       WHERE m.senderId = ? AND m.parentId IS NULL
       ORDER BY m.createdAt DESC`,
      [userId],
    );
    return messages.map((m: any) => this.formatMessageSummary(m));
  }

  /** Single message detail with replies */
  async getMessage(userId: string, messageId: string) {
    const msg = await this.db.queryOne<any>(
      `SELECT m.*, s.name as sName, s.avatarUrl as sAvatar, r.name as rName, r.avatarUrl as rAvatar
       FROM Message m JOIN User s ON m.senderId = s.id JOIN User r ON m.receiverId = r.id
       WHERE m.id = ?`,
      [messageId],
    );
    if (!msg) throw new NotFoundException('Message not found');

    // If this is a reply, redirect to root
    const rootId = msg.parentId ?? msg.id;
    const root = msg.parentId
      ? await this.db.queryOne<any>(
          `SELECT m.*, s.name as sName, s.avatarUrl as sAvatar, r.name as rName, r.avatarUrl as rAvatar
           FROM Message m JOIN User s ON m.senderId = s.id JOIN User r ON m.receiverId = r.id
           WHERE m.id = ?`,
          [rootId],
        )
      : msg;
    if (!root) throw new NotFoundException('Message not found');

    // Check access
    const uid = Number(userId);
    if (uid !== Number(root.senderId) && uid !== Number(root.receiverId)) {
      throw new ForbiddenException('You do not have access to this message');
    }

    // Mark as read if user is the receiver
    if (uid === Number(root.receiverId) && !root.isRead) {
      await this.db.execute('UPDATE Message SET isRead = 1 WHERE id = ?', [root.id]);
    }
    // Also mark replies addressed to this user as read
    await this.db.execute(
      'UPDATE Message SET isRead = 1 WHERE parentId = ? AND receiverId = ? AND isRead = 0',
      [root.id, userId],
    );

    // Get replies
    const replies = await this.db.query<any>(
      `SELECT m.*, s.name as sName, s.avatarUrl as sAvatar, r.name as rName, r.avatarUrl as rAvatar
       FROM Message m JOIN User s ON m.senderId = s.id JOIN User r ON m.receiverId = r.id
       WHERE m.parentId = ?
       ORDER BY m.createdAt ASC`,
      [root.id],
    );

    return {
      ...this.formatMessage(root),
      replies: replies.map((r: any) => this.formatMessage(r)),
    };
  }

  /** Count unread messages for a user */
  async getUnreadCount(userId: string) {
    const row = await this.db.queryOne<any>(
      'SELECT COUNT(*) as count FROM Message WHERE receiverId = ? AND isRead = 0',
      [userId],
    );
    return { count: Number(row?.count ?? 0) };
  }

  /** Mark a single message as read */
  async markRead(userId: string, messageId: string) {
    const msg = await this.db.queryOne<any>('SELECT * FROM Message WHERE id = ?', [messageId]);
    if (!msg) throw new NotFoundException('Message not found');
    if (Number(msg.receiverId) !== Number(userId)) {
      throw new ForbiddenException('Not your message');
    }
    await this.db.execute('UPDATE Message SET isRead = 1 WHERE id = ?', [messageId]);
    return { success: true };
  }

  private formatMessage(m: any) {
    return {
      id: m.id,
      subject: m.subject,
      content: m.content,
      isRead: !!m.isRead,
      createdAt: m.createdAt,
      parentId: m.parentId ?? null,
      sender: { id: m.senderId, name: m.sName, avatarUrl: m.sAvatar ?? null },
      receiver: { id: m.receiverId, name: m.rName, avatarUrl: m.rAvatar ?? null },
    };
  }

  private formatMessageSummary(m: any) {
    return {
      ...this.formatMessage(m),
      replyCount: Number(m.replyCount ?? 0),
    };
  }
}
