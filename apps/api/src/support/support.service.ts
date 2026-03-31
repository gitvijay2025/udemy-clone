import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TicketPriority, TicketStatus, UserRole } from '../common/enums';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';

@Injectable()
export class SupportService {
  constructor(private readonly db: DatabaseService) {}

  async createTicket(userId: string, dto: CreateTicketDto) {
    const ticketResult = await this.db.execute(
      `INSERT INTO SupportTicket (userId, subject, priority, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [userId, dto.subject, (dto.priority as TicketPriority) ?? TicketPriority.MEDIUM, TicketStatus.OPEN],
    );
    const ticketId = ticketResult.insertId;

    await this.db.execute(
      `INSERT INTO TicketMessage (ticketId, userId, content, createdAt)
       VALUES (?, ?, ?, NOW())`,
      [ticketId, userId, dto.message],
    );

    return this.getTicketWithMessages(ticketId);
  }

  async getMyTickets(userId: string) {
    const tickets = await this.db.query<any>(
      'SELECT * FROM SupportTicket WHERE userId = ? ORDER BY updatedAt DESC',
      [userId],
    );
    for (const t of tickets) {
      const msgCount = await this.db.queryOne<any>(
        'SELECT COUNT(*) as cnt FROM TicketMessage WHERE ticketId = ?',
        [t.id],
      );
      t._count = { messages: Number(msgCount?.cnt ?? 0) };
    }
    return tickets;
  }

  async getAllTickets() {
    const tickets = await this.db.query<any>(
      `SELECT t.*, u.id as uId, u.name as uName, u.email as uEmail
       FROM SupportTicket t JOIN User u ON t.userId = u.id
       ORDER BY t.updatedAt DESC`,
    );

    for (const t of tickets) {
      t.user = { id: t.uId, name: t.uName, email: t.uEmail };
      delete t.uId; delete t.uName; delete t.uEmail;

      const msgCount = await this.db.queryOne<any>(
        'SELECT COUNT(*) as cnt FROM TicketMessage WHERE ticketId = ?',
        [t.id],
      );
      t._count = { messages: Number(msgCount?.cnt ?? 0) };
    }

    return tickets;
  }

  async getTicketById(ticketId: string, userId: string, userRole: UserRole) {
    const ticket = await this.db.queryOne<any>(
      `SELECT t.*, u.id as uId, u.name as uName, u.email as uEmail
       FROM SupportTicket t JOIN User u ON t.userId = u.id WHERE t.id = ?`,
      [ticketId],
    );
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (userRole !== UserRole.ADMIN && ticket.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    ticket.user = { id: ticket.uId, name: ticket.uName, email: ticket.uEmail };
    delete ticket.uId; delete ticket.uName; delete ticket.uEmail;

    ticket.messages = await this.db.query<any>(
      `SELECT tm.*, u.id as uId, u.name as uName, u.role as uRole, u.avatarUrl as uAvatar
       FROM TicketMessage tm JOIN User u ON tm.userId = u.id
       WHERE tm.ticketId = ?
       ORDER BY tm.createdAt ASC`,
      [ticketId],
    );
    ticket.messages = ticket.messages.map((m: any) => ({
      id: m.id, ticketId: m.ticketId, userId: m.userId,
      content: m.content, createdAt: m.createdAt,
      user: { id: m.uId, name: m.uName, role: m.uRole, avatarUrl: m.uAvatar },
    }));

    return ticket;
  }

  async reply(ticketId: string, userId: string, userRole: UserRole, dto: ReplyTicketDto) {
    const ticket = await this.db.queryOne<any>(
      'SELECT * FROM SupportTicket WHERE id = ?',
      [ticketId],
    );
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (userRole !== UserRole.ADMIN && ticket.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    const msgResult = await this.db.execute(
      `INSERT INTO TicketMessage (ticketId, userId, content, createdAt)
       VALUES (?, ?, ?, NOW())`,
      [ticketId, userId, dto.content],
    );
    const msgId = msgResult.insertId;

    // Update ticket status if admin replies
    if (userRole === UserRole.ADMIN && ticket.status === TicketStatus.OPEN) {
      await this.db.execute(
        'UPDATE SupportTicket SET status = ?, updatedAt = NOW() WHERE id = ?',
        [TicketStatus.IN_PROGRESS, ticketId],
      );
    }

    const message = await this.db.queryOne<any>(
      `SELECT tm.*, u.id as uId, u.name as uName, u.role as uRole
       FROM TicketMessage tm JOIN User u ON tm.userId = u.id WHERE tm.id = ?`,
      [msgId],
    );

    return {
      id: message.id, ticketId: message.ticketId, userId: message.userId,
      content: message.content, createdAt: message.createdAt,
      user: { id: message.uId, name: message.uName, role: message.uRole },
    };
  }

  async updateTicketStatus(ticketId: string, status: TicketStatus) {
    await this.db.execute(
      'UPDATE SupportTicket SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, ticketId],
    );
    return this.db.queryOne('SELECT * FROM SupportTicket WHERE id = ?', [ticketId]);
  }

  // ─── FAQ ────────────────────────────────────────────────────────────────────

  async getFaqs() {
    return this.db.query('SELECT * FROM FAQ WHERE isPublished = 1 ORDER BY position ASC');
  }

  async getAllFaqs() {
    return this.db.query('SELECT * FROM FAQ ORDER BY position ASC');
  }

  async createFaq(data: { question: string; answer: string; category?: string; position?: number }) {
    const result = await this.db.execute(
      `INSERT INTO FAQ (question, answer, category, position, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [data.question, data.answer, data.category ?? 'General', data.position ?? 0],
    );
    return this.db.queryOne('SELECT * FROM FAQ WHERE id = ?', [result.insertId]);
  }

  async updateFaq(
    id: string,
    data: { question?: string; answer?: string; category?: string; position?: number; isPublished?: boolean },
  ) {
    const sets: string[] = [];
    const params: any[] = [];
    if (data.question !== undefined) { sets.push('question = ?'); params.push(data.question); }
    if (data.answer !== undefined) { sets.push('answer = ?'); params.push(data.answer); }
    if (data.category !== undefined) { sets.push('category = ?'); params.push(data.category); }
    if (data.position !== undefined) { sets.push('position = ?'); params.push(data.position); }
    if (data.isPublished !== undefined) { sets.push('isPublished = ?'); params.push(data.isPublished ? 1 : 0); }

    if (sets.length > 0) {
      sets.push('updatedAt = NOW()');
      params.push(id);
      await this.db.execute(`UPDATE FAQ SET ${sets.join(', ')} WHERE id = ?`, params);
    }
    return this.db.queryOne('SELECT * FROM FAQ WHERE id = ?', [id]);
  }

  async deleteFaq(id: string) {
    await this.db.execute('DELETE FROM FAQ WHERE id = ?', [id]);
    return { deleted: true };
  }

  private async getTicketWithMessages(ticketId: any) {
    const ticket = await this.db.queryOne<any>(
      'SELECT * FROM SupportTicket WHERE id = ?',
      [ticketId],
    );
    if (!ticket) return null;

    ticket.messages = await this.db.query<any>(
      `SELECT tm.*, u.id as uId, u.name as uName, u.role as uRole
       FROM TicketMessage tm JOIN User u ON tm.userId = u.id
       WHERE tm.ticketId = ?
       ORDER BY tm.createdAt ASC`,
      [ticketId],
    );
    ticket.messages = ticket.messages.map((m: any) => ({
      id: m.id, ticketId: m.ticketId, userId: m.userId,
      content: m.content, createdAt: m.createdAt,
      user: { id: m.uId, name: m.uName, role: m.uRole },
    }));

    return ticket;
  }
}
