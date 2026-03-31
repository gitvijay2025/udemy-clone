import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ProgressService {
  constructor(private readonly db: DatabaseService) {}

  async updateLectureProgress(
    userId: string,
    lectureId: string,
    data: { completed?: boolean; watchedSec?: number },
  ) {
    const lecture = await this.db.queryOne<any>(
      `SELECT l.id, s.courseId
       FROM Lecture l JOIN Section s ON l.sectionId = s.id
       WHERE l.id = ?`,
      [lectureId],
    );
    if (!lecture) throw new NotFoundException('Lecture not found');

    const existing = await this.db.queryOne<any>(
      'SELECT id FROM LectureProgress WHERE userId = ? AND lectureId = ?',
      [userId, lectureId],
    );

    if (existing) {
      const sets: string[] = [];
      const params: any[] = [];
      if (data.completed !== undefined) { sets.push('completed = ?'); params.push(data.completed ? 1 : 0); }
      if (data.watchedSec !== undefined) { sets.push('watchedSec = ?'); params.push(data.watchedSec); }
      if (sets.length > 0) {
        sets.push('updatedAt = NOW()');
        params.push(existing.id);
        await this.db.execute(`UPDATE LectureProgress SET ${sets.join(', ')} WHERE id = ?`, params);
      }
    } else {
      await this.db.execute(
        `INSERT INTO LectureProgress (userId, lectureId, completed, watchedSec, updatedAt)
         VALUES (?, ?, ?, ?, NOW())`,
        [userId, lectureId, data.completed ? 1 : 0, data.watchedSec ?? 0],
      );
    }

    const progress = await this.db.queryOne<any>(
      'SELECT * FROM LectureProgress WHERE userId = ? AND lectureId = ?',
      [userId, lectureId],
    );

    // Recalculate course progress
    await this.recalculateCourseProgress(userId, lecture.courseId);

    return progress;
  }

  async getCourseProgress(userId: string, courseId: string) {
    const course = await this.db.queryOne<any>(
      'SELECT id FROM Course WHERE id = ?',
      [courseId],
    );
    if (!course) throw new NotFoundException('Course not found');

    const sections = await this.db.query<any>(
      'SELECT * FROM Section WHERE courseId = ? ORDER BY position ASC',
      [courseId],
    );

    const allLectureIds: string[] = [];

    for (const section of sections) {
      section.lectures = await this.db.query<any>(
        'SELECT id, title, position, durationSec, videoUrl FROM Lecture WHERE sectionId = ? ORDER BY position ASC',
        [section.id],
      );
      for (const l of section.lectures) {
        allLectureIds.push(l.id);
        // Don't expose raw videoUrl — frontend uses signed stream tokens
        l.hasVideo = !!l.videoUrl;
        l.videoUrl = l.hasVideo ? '(protected)' : null;
      }
    }

    let progressRecords: any[] = [];
    if (allLectureIds.length > 0) {
      const placeholders = allLectureIds.map(() => '?').join(',');
      progressRecords = await this.db.query<any>(
        `SELECT * FROM LectureProgress WHERE userId = ? AND lectureId IN (${placeholders})`,
        [userId, ...allLectureIds],
      );
    }

    const progressMap = new Map(progressRecords.map((p: any) => [p.lectureId, p]));

    const sectionsWithProgress = sections.map((section: any) => ({
      ...section,
      lectures: section.lectures.map((lecture: any) => ({
        ...lecture,
        progress: progressMap.get(lecture.id) ?? null,
      })),
    }));

    const totalLectures = allLectureIds.length;
    const completedLectures = progressRecords.filter((p: any) => p.completed).length;
    const overallProgress = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    return {
      courseId,
      sections: sectionsWithProgress,
      totalLectures,
      completedLectures,
      overallProgress,
    };
  }

  private async recalculateCourseProgress(userId: string, courseId: string) {
    const totalResult = await this.db.queryOne<any>(
      `SELECT COUNT(*) as cnt FROM Lecture l
       JOIN Section s ON l.sectionId = s.id
       WHERE s.courseId = ?`,
      [courseId],
    );
    const totalLectures = Number(totalResult?.cnt ?? 0);
    if (totalLectures === 0) return;

    const completedResult = await this.db.queryOne<any>(
      `SELECT COUNT(*) as cnt FROM LectureProgress lp
       JOIN Lecture l ON lp.lectureId = l.id
       JOIN Section s ON l.sectionId = s.id
       WHERE lp.userId = ? AND lp.completed = 1 AND s.courseId = ?`,
      [userId, courseId],
    );
    const completedLectures = Number(completedResult?.cnt ?? 0);
    const progress = Math.round((completedLectures / totalLectures) * 100);

    const enrollment = await this.db.queryOne<any>(
      'SELECT id FROM Enrollment WHERE userId = ? AND courseId = ?',
      [userId, courseId],
    );

    if (enrollment) {
      await this.db.execute(
        'UPDATE Enrollment SET progress = ?, completedAt = ? WHERE id = ?',
        [progress, progress >= 100 ? new Date() : null, enrollment.id],
      );
    }
  }
}
