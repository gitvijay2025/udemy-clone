import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CertificatesService {
  constructor(private readonly db: DatabaseService) {}

  async generate(userId: string, courseId: string) {
    const enrollment = await this.db.queryOne<any>(
      'SELECT id, progress FROM Enrollment WHERE userId = ? AND courseId = ?',
      [userId, courseId],
    );
    if (!enrollment) throw new BadRequestException('Not enrolled in this course');
    if (enrollment.progress < 100) {
      throw new BadRequestException(`Course not completed. Progress: ${enrollment.progress}%`);
    }

    const course = await this.db.queryOne<any>(
      `SELECT c.title, u.name as instructorName
       FROM Course c JOIN User u ON c.instructorId = u.id WHERE c.id = ?`,
      [courseId],
    );

    const user = await this.db.queryOne<any>(
      'SELECT name FROM User WHERE id = ?',
      [userId],
    );

    const existing = await this.db.queryOne<any>(
      'SELECT id FROM Certificate WHERE userId = ? AND courseId = ?',
      [userId, courseId],
    );

    let certId: any;
    if (existing) {
      certId = existing.id;
    } else {
      const result = await this.db.execute(
        `INSERT INTO Certificate (userId, courseId, certificateUrl, issuedAt)
         VALUES (?, ?, '', NOW())`,
        [userId, courseId],
      );
      certId = result.insertId;
    }

    // Update certificateUrl with actual cert id
    const certUrl = `/certificates/${certId}`;
    await this.db.execute(
      'UPDATE Certificate SET certificateUrl = ? WHERE id = ?',
      [certUrl, certId],
    );

    const certificate = await this.db.queryOne<any>(
      'SELECT * FROM Certificate WHERE id = ?',
      [certId],
    );

    return {
      ...certificate,
      courseName: course?.title,
      instructorName: course?.instructorName,
      studentName: user?.name,
    };
  }

  async getMyCertificates(userId: string) {
    const certs = await this.db.query<any>(
      `SELECT cert.*, u.name as userName, c.title as courseTitle, c.slug as courseSlug
       FROM Certificate cert
       JOIN User u ON cert.userId = u.id
       JOIN Course c ON cert.courseId = c.id
       WHERE cert.userId = ?
       ORDER BY cert.issuedAt DESC`,
      [userId],
    );

    return certs.map((c: any) => ({
      id: c.id, userId: c.userId, courseId: c.courseId,
      certificateUrl: `/certificates/${c.id}`, issuedAt: c.issuedAt,
      user: { name: c.userName },
      course: { title: c.courseTitle, slug: c.courseSlug },
    }));
  }

  async verify(certificateId: string) {
    const cert = await this.db.queryOne<any>(
      `SELECT cert.*, u.name as studentName,
              c.title as courseTitle, c.slug as courseSlug,
              i.name as instructorName
       FROM Certificate cert
       JOIN User u ON cert.userId = u.id
       JOIN Course c ON cert.courseId = c.id
       JOIN User i ON c.instructorId = i.id
       WHERE cert.id = ?`,
      [certificateId],
    );
    if (!cert) throw new NotFoundException('Certificate not found');
    return {
      id: cert.id, userId: cert.userId, courseId: cert.courseId,
      certificateUrl: `/certificates/${cert.id}`, issuedAt: cert.issuedAt,
      studentName: cert.studentName,
      courseName: cert.courseTitle,
      courseSlug: cert.courseSlug,
      instructorName: cert.instructorName,
    };
  }
}
