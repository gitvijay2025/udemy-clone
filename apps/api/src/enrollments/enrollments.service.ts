import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly db: DatabaseService) {}

  async enroll(userId: string, courseId: string) {
    const course = await this.db.queryOne<any>(
      'SELECT id, isPublished FROM Course WHERE id = ?',
      [courseId],
    );
    if (!course) throw new NotFoundException('Course not found');
    if (!course.isPublished) throw new BadRequestException('Course is not published yet');

    const existing = await this.db.queryOne<any>(
      'SELECT id FROM Enrollment WHERE userId = ? AND courseId = ?',
      [userId, courseId],
    );

    let enrollmentId: any;
    if (existing) {
      enrollmentId = existing.id;
    } else {
      const result = await this.db.execute(
        `INSERT INTO Enrollment (userId, courseId, progress, enrolledAt)
         VALUES (?, ?, 0, NOW())`,
        [userId, courseId],
      );
      enrollmentId = result.insertId;
    }

    const enrollment = await this.db.queryOne<any>(
      `SELECT e.id, e.enrolledAt, e.progress,
              c.id as courseId, c.slug, c.title, c.thumbnailUrl, c.level
       FROM Enrollment e
       JOIN Course c ON e.courseId = c.id
       WHERE e.id = ?`,
      [enrollmentId],
    );

    return {
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      progress: enrollment.progress,
      course: {
        id: enrollment.courseId,
        slug: enrollment.slug,
        title: enrollment.title,
        thumbnailUrl: enrollment.thumbnailUrl,
        level: enrollment.level,
      },
    };
  }

  async myLearning(userId: string) {
    const enrollments = await this.db.query<any>(
      `SELECT e.id, e.progress, e.enrolledAt, e.completedAt,
              c.id as courseId, c.slug, c.title, c.description, c.thumbnailUrl, c.level,
              u.id as instructorId, u.name as instructorName
       FROM Enrollment e
       JOIN Course c ON e.courseId = c.id
       JOIN User u ON c.instructorId = u.id
       WHERE e.userId = ?
       ORDER BY e.enrolledAt DESC`,
      [userId],
    );

    return enrollments.map((e: any) => ({
      id: e.id,
      progress: e.progress,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
      course: {
        id: e.courseId,
        slug: e.slug,
        title: e.title,
        description: e.description,
        thumbnailUrl: e.thumbnailUrl,
        level: e.level,
        instructor: { id: e.instructorId, name: e.instructorName },
      },
    }));
  }
}
