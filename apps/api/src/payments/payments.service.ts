import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly db: DatabaseService) {}

  async validateCoupon(code: string, courseId?: string) {
    const coupon = await this.db.queryOne<any>(
      'SELECT * FROM Coupon WHERE code = ?',
      [code.toUpperCase()],
    );

    if (!coupon) return { valid: false, message: 'Coupon not found' };
    if (!coupon.isActive) return { valid: false, message: 'Coupon is inactive' };
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, message: 'Coupon has expired' };
    }
    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, message: 'Coupon usage limit reached' };
    }
    if (coupon.courseId && courseId && coupon.courseId !== courseId) {
      return { valid: false, message: 'Coupon not valid for this course' };
    }

    return {
      valid: true,
      discountPercent: coupon.discountPercent,
      code: coupon.code,
    };
  }

  async getWallet(userId: string) {
    let wallet = await this.db.queryOne<any>(
      'SELECT * FROM Wallet WHERE userId = ?',
      [userId],
    );

    if (!wallet) {
      const result = await this.db.execute(
        'INSERT INTO Wallet (userId, balance, updatedAt) VALUES (?, 0, NOW())',
        [userId],
      );
      wallet = await this.db.queryOne<any>('SELECT * FROM Wallet WHERE id = ?', [result.insertId]);
    }

    const transactions = await this.db.query<any>(
      'SELECT * FROM WalletTransaction WHERE walletId = ? ORDER BY createdAt DESC LIMIT 50',
      [wallet.id],
    );

    return { ...wallet, transactions };
  }

  async getInstructorRevenue(instructorId: string) {
    const wallet = await this.db.queryOne<any>(
      'SELECT * FROM Wallet WHERE userId = ?',
      [instructorId],
    );

    let transactions: any[] = [];
    if (wallet) {
      transactions = await this.db.query<any>(
        'SELECT * FROM WalletTransaction WHERE walletId = ? ORDER BY createdAt DESC LIMIT 100',
        [wallet.id],
      );
    }

    const courses = await this.db.query<any>(
      `SELECT c.id, c.title, c.price,
              (SELECT COUNT(*) FROM Enrollment e WHERE e.courseId = c.id) as enrollmentCount
       FROM Course c WHERE c.instructorId = ?`,
      [instructorId],
    );

    const totalRevenue = courses.reduce(
      (sum: number, c: any) => sum + Number(c.price) * Number(c.enrollmentCount) * 0.7,
      0,
    );

    return {
      wallet: wallet ? { ...wallet, transactions } : null,
      courses: courses.map((c: any) => ({
        id: c.id, title: c.title, price: c.price,
        _count: { enrollments: Number(c.enrollmentCount) },
      })),
      totalRevenue,
      totalStudents: courses.reduce((sum: number, c: any) => sum + Number(c.enrollmentCount), 0),
    };
  }
}
