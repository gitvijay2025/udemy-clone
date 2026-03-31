import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CartService {
  constructor(private readonly db: DatabaseService) {}

  private async getOrCreateCart(userId: string): Promise<any> {
    let cart = await this.db.queryOne<any>(
      'SELECT id FROM Cart WHERE userId = ?',
      [userId],
    );
    if (!cart) {
      const result = await this.db.execute(
        'INSERT INTO Cart (userId, updatedAt) VALUES (?, NOW())',
        [userId],
      );
      cart = { id: result.insertId };
    }
    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    const items = await this.db.query<any>(
      'SELECT * FROM CartItem WHERE cartId = ? ORDER BY addedAt DESC',
      [cart.id],
    );
    return { ...cart, items };
  }

  async getCartWithDetails(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const items = await this.db.query<any>(
      'SELECT * FROM CartItem WHERE cartId = ? ORDER BY addedAt DESC',
      [cart.id],
    );

    if (items.length === 0) {
      return { cartId: cart.id, items: [], totalAmount: 0 };
    }

    const courseIds = items.map((i: any) => i.courseId);
    const placeholders = courseIds.map(() => '?').join(',');
    const courses = await this.db.query<any>(
      `SELECT c.id, c.title, c.slug, c.price, c.thumbnailUrl, c.level,
              u.id as instructorId, u.name as instructorName
       FROM Course c JOIN User u ON c.instructorId = u.id
       WHERE c.id IN (${placeholders})`,
      courseIds,
    );

    const courseMap = new Map(courses.map((c: any) => [c.id, c]));

    const cartItems = items.map((item: any) => {
      const c = courseMap.get(item.courseId);
      return {
        id: item.id,
        courseId: item.courseId,
        addedAt: item.addedAt,
        course: c ? {
          id: c.id, title: c.title, slug: c.slug, price: c.price,
          thumbnailUrl: c.thumbnailUrl, level: c.level,
          instructor: { id: c.instructorId, name: c.instructorName },
        } : null,
      };
    });

    const totalAmount = courses.reduce((sum: number, c: any) => sum + Number(c.price), 0);

    return { cartId: cart.id, items: cartItems, totalAmount };
  }

  async addItem(userId: string, courseId: string) {
    const course = await this.db.queryOne<any>(
      'SELECT id, isPublished FROM Course WHERE id = ?',
      [courseId],
    );
    if (!course || !course.isPublished) {
      throw new NotFoundException('Course not found or not published');
    }

    const enrollment = await this.db.queryOne<any>(
      'SELECT id FROM Enrollment WHERE userId = ? AND courseId = ?',
      [userId, courseId],
    );
    if (enrollment) {
      throw new BadRequestException('Already enrolled in this course');
    }

    const cart = await this.getOrCreateCart(userId);

    const existing = await this.db.queryOne<any>(
      'SELECT id FROM CartItem WHERE cartId = ? AND courseId = ?',
      [cart.id, courseId],
    );
    if (existing) {
      throw new BadRequestException('Course already in cart');
    }

    await this.db.execute(
      'INSERT INTO CartItem (cartId, courseId, addedAt) VALUES (?, ?, NOW())',
      [cart.id, courseId],
    );

    return this.getCartWithDetails(userId);
  }

  async removeItem(userId: string, courseId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.db.execute(
      'DELETE FROM CartItem WHERE cartId = ? AND courseId = ?',
      [cart.id, courseId],
    );
    return this.getCartWithDetails(userId);
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.db.execute('DELETE FROM CartItem WHERE cartId = ?', [cart.id]);
    return { message: 'Cart cleared' };
  }
}
