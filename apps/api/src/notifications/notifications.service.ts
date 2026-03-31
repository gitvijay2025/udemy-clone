import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationType } from '../common/enums';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: DatabaseService) {}

  async create(
    userId: string,
    data: { type: NotificationType; title: string; message: string; link?: string },
  ) {
    const result = await this.db.execute(
      `INSERT INTO Notification (userId, type, title, message, link, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, data.type, data.title, data.message, data.link ?? null],
    );
    return this.db.queryOne('SELECT * FROM Notification WHERE id = ?', [result.insertId]);
  }

  async findByUser(userId: string) {
    return this.db.query(
      'SELECT * FROM Notification WHERE userId = ? ORDER BY createdAt DESC LIMIT 50',
      [userId],
    );
  }

  async getUnreadCount(userId: string) {
    const result = await this.db.queryOne<any>(
      'SELECT COUNT(*) as cnt FROM Notification WHERE userId = ? AND isRead = 0',
      [userId],
    );
    return { unreadCount: Number(result?.cnt ?? 0) };
  }

  async markAsRead(userId: string, notificationId: string) {
    const result = await this.db.execute(
      'UPDATE Notification SET isRead = 1 WHERE id = ? AND userId = ?',
      [notificationId, userId],
    );
    return { count: result.affectedRows };
  }

  async markAllAsRead(userId: string) {
    const result = await this.db.execute(
      'UPDATE Notification SET isRead = 1 WHERE userId = ? AND isRead = 0',
      [userId],
    );
    return { count: result.affectedRows };
  }

  async remove(userId: string, notificationId: string) {
    const result = await this.db.execute(
      'DELETE FROM Notification WHERE id = ? AND userId = ?',
      [notificationId, userId],
    );
    return { count: result.affectedRows };
  }
}
