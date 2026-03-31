import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PaymentStatus } from '../common/enums';

@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}

  async checkout(userId: string, couponCode?: string) {
    const cart = await this.db.queryOne<any>(
      'SELECT id FROM Cart WHERE userId = ?',
      [userId],
    );
    if (!cart) throw new BadRequestException('Cart is empty');

    const items = await this.db.query<any>(
      'SELECT * FROM CartItem WHERE cartId = ?',
      [cart.id],
    );
    if (items.length === 0) throw new BadRequestException('Cart is empty');

    const courseIds = items.map((i: any) => i.courseId);
    const placeholders = courseIds.map(() => '?').join(',');

    // Check existing enrollments
    const existingEnrollments = await this.db.query<any>(
      `SELECT courseId FROM Enrollment WHERE userId = ? AND courseId IN (${placeholders})`,
      [userId, ...courseIds],
    );
    const enrolledIds = new Set(existingEnrollments.map((e: any) => e.courseId));
    const newCourseIds = courseIds.filter((id: string) => !enrolledIds.has(id));

    if (newCourseIds.length === 0) {
      throw new BadRequestException('Already enrolled in all cart courses');
    }

    const newPlaceholders = newCourseIds.map(() => '?').join(',');
    const courses = await this.db.query<any>(
      `SELECT id, price, instructorId FROM Course WHERE id IN (${newPlaceholders}) AND isPublished = 1`,
      newCourseIds,
    );

    let totalAmount = courses.reduce((sum: number, c: any) => sum + Number(c.price), 0);
    let couponId: string | null = null;

    if (couponCode) {
      const coupon = await this.db.queryOne<any>(
        'SELECT * FROM Coupon WHERE code = ?',
        [couponCode.toUpperCase()],
      );

      if (
        coupon &&
        coupon.isActive &&
        (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date()) &&
        (!coupon.maxUses || coupon.currentUses < coupon.maxUses)
      ) {
        totalAmount = totalAmount * (1 - coupon.discountPercent / 100);
        couponId = coupon.id;

        await this.db.execute(
          'UPDATE Coupon SET currentUses = currentUses + 1 WHERE id = ?',
          [coupon.id],
        );
      }
    }

    // Create order
    const orderResult = await this.db.execute(
      `INSERT INTO \`Order\` (userId, totalAmount, status, couponId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [userId, totalAmount, PaymentStatus.COMPLETED, couponId],
    );
    const orderId = orderResult.insertId;

    // Create order items
    for (const course of courses) {
      await this.db.execute(
        'INSERT INTO OrderItem (orderId, courseId, price) VALUES (?, ?, ?)',
        [orderId, course.id, course.price],
      );
    }

    // Enroll user in purchased courses
    for (const course of courses) {
      const existing = await this.db.queryOne<any>(
        'SELECT id FROM Enrollment WHERE userId = ? AND courseId = ?',
        [userId, course.id],
      );
      if (!existing) {
        await this.db.execute(
          'INSERT INTO Enrollment (userId, courseId, progress, enrolledAt) VALUES (?, ?, 0, NOW())',
          [userId, course.id],
        );
      }
    }

    // Credit instructor wallets (70% share)
    for (const course of courses) {
      if (course.instructorId) {
        const instructorShare = Number(course.price) * 0.7;

        let wallet = await this.db.queryOne<any>(
          'SELECT id, balance FROM Wallet WHERE userId = ?',
          [course.instructorId],
        );

        if (!wallet) {
          const walletResult = await this.db.execute(
            'INSERT INTO Wallet (userId, balance, updatedAt) VALUES (?, ?, NOW())',
            [course.instructorId, instructorShare],
          );
          wallet = { id: walletResult.insertId };
        } else {
          await this.db.execute(
            'UPDATE Wallet SET balance = balance + ?, updatedAt = NOW() WHERE id = ?',
            [instructorShare, wallet.id],
          );
        }

        await this.db.execute(
          `INSERT INTO WalletTransaction (walletId, amount, type, description, createdAt)
           VALUES (?, ?, 'CREDIT', ?, NOW())`,
          [wallet.id, instructorShare, `Sale of course (order: ${orderId})`],
        );
      }
    }

    // Clear cart
    await this.db.execute('DELETE FROM CartItem WHERE cartId = ?', [cart.id]);

    // Create notification
    await this.db.execute(
      `INSERT INTO Notification (userId, type, title, message, link, createdAt)
       VALUES (?, 'PAYMENT', 'Purchase Successful', ?, '/my-learning', NOW())`,
      [userId, `You purchased ${courses.length} course(s) for $${totalAmount.toFixed(2)}`],
    );

    // Return order with items
    const order = await this.db.queryOne<any>(
      'SELECT * FROM `Order` WHERE id = ?',
      [orderId],
    );
    const orderItems = await this.db.query<any>(
      'SELECT * FROM OrderItem WHERE orderId = ?',
      [orderId],
    );
    return { ...order, items: orderItems };
  }

  async getOrders(userId: string) {
    const orders = await this.db.query<any>(
      'SELECT * FROM `Order` WHERE userId = ? ORDER BY createdAt DESC',
      [userId],
    );

    for (const order of orders) {
      order.items = await this.db.query<any>(
        `SELECT oi.*, c.id as cId, c.title as cTitle, c.slug as cSlug, c.thumbnailUrl as cThumb
         FROM OrderItem oi
         LEFT JOIN Course c ON oi.courseId = c.id
         WHERE oi.orderId = ?`,
        [order.id],
      );
      order.items = order.items.map((i: any) => ({
        id: i.id, orderId: i.orderId, courseId: i.courseId, price: i.price,
        course: { id: i.cId, title: i.cTitle, slug: i.cSlug, thumbnailUrl: i.cThumb },
      }));

      if (order.couponId) {
        order.coupon = await this.db.queryOne<any>(
          'SELECT code, discountPercent FROM Coupon WHERE id = ?',
          [order.couponId],
        );
      } else {
        order.coupon = null;
      }
    }

    return orders;
  }

  async getOrderById(userId: string, orderId: string) {
    const order = await this.db.queryOne<any>(
      'SELECT * FROM `Order` WHERE id = ? AND userId = ?',
      [orderId, userId],
    );
    if (!order) throw new NotFoundException('Order not found');

    order.items = await this.db.query<any>(
      `SELECT oi.*, c.id as cId, c.title as cTitle, c.slug as cSlug, c.thumbnailUrl as cThumb
       FROM OrderItem oi
       LEFT JOIN Course c ON oi.courseId = c.id
       WHERE oi.orderId = ?`,
      [order.id],
    );
    order.items = order.items.map((i: any) => ({
      id: i.id, orderId: i.orderId, courseId: i.courseId, price: i.price,
      course: { id: i.cId, title: i.cTitle, slug: i.cSlug, thumbnailUrl: i.cThumb },
    }));

    if (order.couponId) {
      order.coupon = await this.db.queryOne<any>(
        'SELECT code, discountPercent FROM Coupon WHERE id = ?',
        [order.couponId],
      );
    }

    return order;
  }

  async requestRefund(userId: string, orderId: string) {
    const order = await this.db.queryOne<any>(
      'SELECT * FROM `Order` WHERE id = ? AND userId = ? AND status = ?',
      [orderId, userId, PaymentStatus.COMPLETED],
    );
    if (!order) throw new NotFoundException('Order not found or already refunded');

    await this.db.execute(
      'UPDATE `Order` SET status = ?, updatedAt = NOW() WHERE id = ?',
      [PaymentStatus.REFUNDED, orderId],
    );

    return this.db.queryOne('SELECT * FROM `Order` WHERE id = ?', [orderId]);
  }
}
