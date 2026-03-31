import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly db: DatabaseService) {}

  async create(userId: string, courseId: string, dto: CreateReviewDto) {
    const enrollment = await this.db.queryOne<any>(
      'SELECT id FROM Enrollment WHERE userId = ? AND courseId = ?',
      [userId, courseId],
    );
    if (!enrollment) {
      throw new BadRequestException('You must be enrolled to review this course');
    }

    const existing = await this.db.queryOne<any>(
      'SELECT id FROM Review WHERE userId = ? AND courseId = ?',
      [userId, courseId],
    );

    if (existing) {
      await this.db.execute(
        'UPDATE Review SET rating = ?, comment = ?, updatedAt = NOW() WHERE id = ?',
        [dto.rating, dto.comment ?? null, existing.id],
      );
      return this.getReviewWithUser(existing.id);
    }

    const result = await this.db.execute(
      `INSERT INTO Review (userId, courseId, rating, comment, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [userId, courseId, dto.rating, dto.comment ?? null],
    );
    return this.getReviewWithUser(result.insertId);
  }

  async findByCourse(courseId: string) {
    const reviews = await this.db.query<any>(
      `SELECT r.*, u.id as uId, u.name as uName, u.avatarUrl as uAvatar
       FROM Review r JOIN User u ON r.userId = u.id
       WHERE r.courseId = ?
       ORDER BY r.createdAt DESC`,
      [courseId],
    );

    const stats = await this.db.queryOne<any>(
      'SELECT AVG(rating) as avgRating, COUNT(*) as total FROM Review WHERE courseId = ?',
      [courseId],
    );

    return {
      reviews: reviews.map((r: any) => ({
        id: r.id, rating: r.rating, comment: r.comment,
        userId: r.userId, courseId: r.courseId,
        createdAt: r.createdAt, updatedAt: r.updatedAt,
        user: { id: r.uId, name: r.uName, avatarUrl: r.uAvatar },
      })),
      averageRating: stats?.avgRating ? Number(stats.avgRating) : 0,
      totalReviews: Number(stats?.total ?? 0),
    };
  }

  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await this.db.queryOne<any>(
      'SELECT id, userId FROM Review WHERE id = ?',
      [reviewId],
    );
    if (!review || review.userId !== userId) {
      throw new NotFoundException('Review not found');
    }

    const sets: string[] = [];
    const params: any[] = [];
    if (dto.rating !== undefined) { sets.push('rating = ?'); params.push(dto.rating); }
    if (dto.comment !== undefined) { sets.push('comment = ?'); params.push(dto.comment); }
    sets.push('updatedAt = NOW()');
    params.push(reviewId);

    await this.db.execute(`UPDATE Review SET ${sets.join(', ')} WHERE id = ?`, params);
    return this.db.queryOne('SELECT * FROM Review WHERE id = ?', [reviewId]);
  }

  async remove(userId: string, reviewId: string, isAdmin: boolean) {
    const review = await this.db.queryOne<any>('SELECT * FROM Review WHERE id = ?', [reviewId]);
    if (!review) throw new NotFoundException('Review not found');
    if (!isAdmin && review.userId !== userId) {
      throw new BadRequestException('Cannot delete this review');
    }
    await this.db.execute('DELETE FROM Review WHERE id = ?', [reviewId]);
    return review;
  }

  private async getReviewWithUser(reviewId: any) {
    const r = await this.db.queryOne<any>(
      `SELECT r.*, u.id as uId, u.name as uName, u.avatarUrl as uAvatar
       FROM Review r JOIN User u ON r.userId = u.id WHERE r.id = ?`,
      [reviewId],
    );
    if (!r) return null;
    return {
      id: r.id, rating: r.rating, comment: r.comment,
      userId: r.userId, courseId: r.courseId,
      createdAt: r.createdAt, updatedAt: r.updatedAt,
      user: { id: r.uId, name: r.uName, avatarUrl: r.uAvatar },
    };
  }
}
