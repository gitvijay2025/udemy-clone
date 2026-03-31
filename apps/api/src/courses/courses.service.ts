import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CourseLevel, UserRole } from '../common/enums';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

export interface CourseSearchParams {
  search?: string;
  category?: string;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  limit?: number;
}

@Injectable()
export class CoursesService {
  constructor(private readonly db: DatabaseService) {}

  async create(instructorId: string, dto: CreateCourseDto) {
    const result = await this.db.execute(
      `INSERT INTO Course (title, slug, description, price, thumbnailUrl, previewVideoUrl,
        level, language, requirements, targetAudience, instructorId, categoryId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        dto.title,
        dto.slug.toLowerCase(),
        dto.description,
        dto.price,
        dto.thumbnailUrl ?? null,
        dto.previewVideoUrl ?? null,
        dto.level ?? 'BEGINNER',
        dto.language ?? 'English',
        dto.requirements ? JSON.stringify(dto.requirements) : null,
        dto.targetAudience ? JSON.stringify(dto.targetAudience) : null,
        instructorId,
        dto.categoryId ?? null,
      ],
    );

    return this.getCourseWithInstructor(result.insertId);
  }

  async findPublished(params: CourseSearchParams = {}) {
    const {
      search,
      category,
      level,
      minPrice,
      maxPrice,
      language,
      sort = 'newest',
      page = 1,
      limit = 20,
    } = params;

    const conditions: string[] = ['c.isPublished = 1'];
    const queryParams: any[] = [];

    if (search) {
      conditions.push('(c.title LIKE ? OR c.description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      conditions.push('cat.slug = ?');
      queryParams.push(category);
    }
    if (level) {
      conditions.push('c.level = ?');
      queryParams.push(level);
    }
    if (language) {
      conditions.push('c.language = ?');
      queryParams.push(language);
    }
    if (minPrice !== undefined) {
      conditions.push('c.price >= ?');
      queryParams.push(minPrice);
    }
    if (maxPrice !== undefined) {
      conditions.push('c.price <= ?');
      queryParams.push(maxPrice);
    }

    const whereClause = conditions.join(' AND ');

    let orderByClause: string;
    switch (sort) {
      case 'popular':
        orderByClause = 'enrollmentCount DESC';
        break;
      case 'price_asc':
        orderByClause = 'c.price ASC';
        break;
      case 'price_desc':
        orderByClause = 'c.price DESC';
        break;
      case 'rating':
        orderByClause = 'avgRating DESC';
        break;
      default:
        orderByClause = 'c.createdAt DESC';
    }

    const offset = (page - 1) * limit;

    const courses = await this.db.query<any>(
      `SELECT c.id, c.title, c.slug, c.description, c.price, c.level, c.thumbnailUrl,
              c.isPublished, c.createdAt, c.updatedAt, c.language,
              u.id as instructorId, u.name as instructorName, u.email as instructorEmail,
              cat.id as categoryId, cat.name as categoryName, cat.slug as categorySlug,
              (SELECT COUNT(*) FROM Enrollment e WHERE e.courseId = c.id) as enrollmentCount,
              (SELECT COUNT(*) FROM Review r WHERE r.courseId = c.id) as reviewCount,
              (SELECT AVG(r.rating) FROM Review r WHERE r.courseId = c.id) as avgRating
       FROM Course c
       JOIN User u ON c.instructorId = u.id
       LEFT JOIN Category cat ON c.categoryId = cat.id
       WHERE ${whereClause}
       ORDER BY ${orderByClause}
       LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      queryParams,
    );

    const countResult = await this.db.queryOne<any>(
      `SELECT COUNT(*) as total FROM Course c
       LEFT JOIN Category cat ON c.categoryId = cat.id
       WHERE ${whereClause}`,
      queryParams,
    );
    const total = Number(countResult?.total ?? 0);

    const enriched = courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      price: c.price,
      level: c.level,
      thumbnailUrl: c.thumbnailUrl,
      isPublished: !!c.isPublished,
      language: c.language,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      instructor: { id: c.instructorId, name: c.instructorName, email: c.instructorEmail },
      category: c.categoryId
        ? { id: c.categoryId, name: c.categoryName, slug: c.categorySlug }
        : null,
      _count: { enrollments: Number(c.enrollmentCount), reviews: Number(c.reviewCount) },
      averageRating: c.avgRating ? Math.round(Number(c.avgRating) * 10) / 10 : 0,
    }));

    return {
      courses: enriched,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
    const course = await this.db.queryOne<any>(
      `SELECT c.*, u.id as instructorId, u.name as instructorName, u.email as instructorEmail,
              cat.id as categoryId, cat.name as categoryName, cat.slug as categorySlug
       FROM Course c
       JOIN User u ON c.instructorId = u.id
       LEFT JOIN Category cat ON c.categoryId = cat.id
       WHERE c.slug = ? AND c.isPublished = 1`,
      [slug.toLowerCase()],
    );
    if (!course) throw new NotFoundException('Course not found');

    // Get review stats
    const reviewStats = await this.db.queryOne<any>(
      'SELECT COUNT(*) as reviewCount, COALESCE(AVG(rating), 0) as avgRating FROM Review WHERE courseId = ?',
      [course.id],
    );

    // Get enrollment count
    const enrollmentStats = await this.db.queryOne<any>(
      'SELECT COUNT(*) as enrollmentCount FROM Enrollment WHERE courseId = ?',
      [course.id],
    );

    const sections = await this.db.query<any>(
      `SELECT id, title, position, isPublished, createdAt FROM Section
       WHERE courseId = ? ORDER BY position ASC`,
      [course.id],
    );

    for (const section of sections) {
      section.isPublished = !!section.isPublished;
      section.lectures = await this.db.query<any>(
        `SELECT id, title, position, isPublished, isFreePreview, durationSec, content, videoUrl
         FROM Lecture WHERE sectionId = ? ORDER BY position ASC`,
        [section.id],
      );
      for (const l of section.lectures) {
        l.isPublished = !!l.isPublished;
        l.isFreePreview = !!l.isFreePreview;
        l.resources = await this.db.query<any>(
          'SELECT id, title, fileUrl, fileType, fileSize, createdAt FROM Resource WHERE lectureId = ? ORDER BY createdAt ASC',
          [l.id],
        );
      }
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      price: course.price,
      level: course.level,
      language: course.language,
      thumbnailUrl: course.thumbnailUrl,
      previewVideoUrl: course.previewVideoUrl,
      requirements: course.requirements,
      targetAudience: course.targetAudience,
      isPublished: !!course.isPublished,
      averageRating: Number(reviewStats?.avgRating ?? 0),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      instructor: { id: course.instructorId, name: course.instructorName, email: course.instructorEmail },
      category: course.categoryId
        ? { id: course.categoryId, name: course.categoryName, slug: course.categorySlug }
        : null,
      _count: {
        enrollments: Number(enrollmentStats?.enrollmentCount ?? 0),
        reviews: Number(reviewStats?.reviewCount ?? 0),
      },
      sections,
    };
  }

  async findInstructorCourses(instructorId: string) {
    const courses = await this.db.query<any>(
      `SELECT c.*, u.id as iId, u.name as iName, u.email as iEmail
       FROM Course c JOIN User u ON c.instructorId = u.id
       WHERE c.instructorId = ? ORDER BY c.createdAt DESC`,
      [instructorId],
    );

    for (const course of courses) {
      course.isPublished = !!course.isPublished;
      course.instructor = { id: course.iId, name: course.iName, email: course.iEmail };
      delete course.iId; delete course.iName; delete course.iEmail;

      course.sections = await this.db.query<any>(
        `SELECT id, title, position, isPublished FROM Section
         WHERE courseId = ? ORDER BY position ASC`,
        [course.id],
      );
      for (const section of course.sections) {
        section.isPublished = !!section.isPublished;
        section.lectures = await this.db.query<any>(
          `SELECT id, title, position, durationSec, content, isPublished, videoUrl
           FROM Lecture WHERE sectionId = ? ORDER BY position ASC`,
          [section.id],
        );
        section.lectures.forEach((l: any) => (l.isPublished = !!l.isPublished));
      }
    }

    return courses;
  }

  async update(courseId: string, userId: string, userRole: UserRole, dto: UpdateCourseDto) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const sets: string[] = [];
    const params: any[] = [];

    if (dto.title !== undefined) { sets.push('title = ?'); params.push(dto.title); }
    if (dto.slug !== undefined) { sets.push('slug = ?'); params.push(dto.slug.toLowerCase()); }
    if (dto.description !== undefined) { sets.push('description = ?'); params.push(dto.description); }
    if (dto.price !== undefined) { sets.push('price = ?'); params.push(dto.price); }
    if (dto.thumbnailUrl !== undefined) { sets.push('thumbnailUrl = ?'); params.push(dto.thumbnailUrl); }
    if (dto.previewVideoUrl !== undefined) { sets.push('previewVideoUrl = ?'); params.push(dto.previewVideoUrl); }
    if (dto.level !== undefined) { sets.push('level = ?'); params.push(dto.level); }
    if (dto.language !== undefined) { sets.push('language = ?'); params.push(dto.language); }
    if (dto.requirements !== undefined) { sets.push('requirements = ?'); params.push(JSON.stringify(dto.requirements)); }
    if (dto.targetAudience !== undefined) { sets.push('targetAudience = ?'); params.push(JSON.stringify(dto.targetAudience)); }
    if (dto.categoryId !== undefined) { sets.push('categoryId = ?'); params.push(dto.categoryId); }

    if (sets.length > 0) {
      sets.push('updatedAt = NOW()');
      params.push(courseId);
      await this.db.execute(`UPDATE Course SET ${sets.join(', ')} WHERE id = ?`, params);
    }

    return this.getCourseWithInstructor(courseId);
  }

  async publish(courseId: string, userId: string, userRole: UserRole) {
    await this.assertCourseAccess(courseId, userId, userRole);
    await this.db.execute(
      'UPDATE Course SET isPublished = 1, updatedAt = NOW() WHERE id = ?',
      [courseId],
    );
    return this.getCourseWithInstructor(courseId);
  }

  async createSection(courseId: string, userId: string, userRole: UserRole, dto: CreateSectionDto) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const countResult = await this.db.queryOne<any>(
      'SELECT COUNT(*) as cnt FROM Section WHERE courseId = ?',
      [courseId],
    );
    const position = dto.position ?? (Number(countResult?.cnt ?? 0) + 1);

    const result = await this.db.execute(
      `INSERT INTO Section (courseId, title, position, isPublished, createdAt, updatedAt)
       VALUES (?, ?, ?, 0, NOW(), NOW())`,
      [courseId, dto.title, position],
    );

    return this.db.queryOne<any>(
      'SELECT id, courseId, title, position, isPublished, createdAt FROM Section WHERE id = ?',
      [result.insertId],
    );
  }

  async createLecture(
    courseId: string,
    sectionId: string,
    userId: string,
    userRole: UserRole,
    dto: CreateLectureDto,
    videoUrl: string,
  ) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const section = await this.db.queryOne<any>(
      'SELECT id FROM Section WHERE id = ? AND courseId = ?',
      [sectionId, courseId],
    );
    if (!section) throw new NotFoundException('Section not found in this course');

    const countResult = await this.db.queryOne<any>(
      'SELECT COUNT(*) as cnt FROM Lecture WHERE sectionId = ?',
      [sectionId],
    );
    const position = dto.position ?? (Number(countResult?.cnt ?? 0) + 1);

    const result = await this.db.execute(
      `INSERT INTO Lecture (sectionId, title, position, durationSec, content, videoUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [sectionId, dto.title, position, dto.durationSec ?? null, dto.content ?? null, videoUrl],
    );

    return this.db.queryOne<any>(
      'SELECT id, title, position, durationSec, content, videoUrl, isPublished FROM Lecture WHERE id = ?',
      [result.insertId],
    );
  }

  async findInstructorCourseById(courseId: string, userId: string, userRole: UserRole) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const course = await this.db.queryOne<any>(
      `SELECT c.*, u.id as iId, u.name as iName, u.email as iEmail
       FROM Course c JOIN User u ON c.instructorId = u.id WHERE c.id = ?`,
      [courseId],
    );
    if (!course) throw new NotFoundException('Course not found');

    course.isPublished = !!course.isPublished;
    course.instructor = { id: course.iId, name: course.iName, email: course.iEmail };
    delete course.iId; delete course.iName; delete course.iEmail;

    course.sections = await this.db.query<any>(
      'SELECT id, title, position, isPublished FROM Section WHERE courseId = ? ORDER BY position ASC',
      [courseId],
    );
    for (const section of course.sections) {
      section.isPublished = !!section.isPublished;
      section.lectures = await this.db.query<any>(
        `SELECT id, title, position, durationSec, content, isPublished, isFreePreview, videoUrl
         FROM Lecture WHERE sectionId = ? ORDER BY position ASC`,
        [section.id],
      );
      for (const l of section.lectures) {
        l.isPublished = !!l.isPublished;
        l.isFreePreview = !!l.isFreePreview;
        l.resources = await this.db.query<any>(
          'SELECT id, title, fileUrl, fileType, fileSize, createdAt FROM Resource WHERE lectureId = ? ORDER BY createdAt ASC',
          [l.id],
        );
      }
    }

    return course;
  }

  async updateSection(
    courseId: string,
    sectionId: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateSectionDto,
  ) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const section = await this.db.queryOne<any>(
      'SELECT id FROM Section WHERE id = ? AND courseId = ?',
      [sectionId, courseId],
    );
    if (!section) throw new NotFoundException('Section not found in this course');

    const sets: string[] = [];
    const params: any[] = [];
    if (dto.title !== undefined) { sets.push('title = ?'); params.push(dto.title); }
    if (dto.position !== undefined) { sets.push('position = ?'); params.push(dto.position); }
    if (dto.isPublished !== undefined) { sets.push('isPublished = ?'); params.push(dto.isPublished ? 1 : 0); }

    if (sets.length > 0) {
      sets.push('updatedAt = NOW()');
      params.push(sectionId);
      await this.db.execute(`UPDATE Section SET ${sets.join(', ')} WHERE id = ?`, params);
    }

    return this.db.queryOne<any>(
      'SELECT id, title, position, isPublished FROM Section WHERE id = ?',
      [sectionId],
    );
  }

  async updateLecture(
    courseId: string,
    sectionId: string,
    lectureId: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateLectureDto,
    videoUrl?: string,
  ) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const lecture = await this.db.queryOne<any>(
      `SELECT l.id FROM Lecture l
       JOIN Section s ON l.sectionId = s.id
       WHERE l.id = ? AND l.sectionId = ? AND s.courseId = ?`,
      [lectureId, sectionId, courseId],
    );
    if (!lecture) throw new NotFoundException('Lecture not found in this section');

    const sets: string[] = [];
    const params: any[] = [];
    if (dto.title !== undefined) { sets.push('title = ?'); params.push(dto.title); }
    if (dto.position !== undefined) { sets.push('position = ?'); params.push(dto.position); }
    if (dto.durationSec !== undefined) { sets.push('durationSec = ?'); params.push(dto.durationSec); }
    if (dto.content !== undefined) { sets.push('content = ?'); params.push(dto.content); }
    if (dto.isPublished !== undefined) { sets.push('isPublished = ?'); params.push(dto.isPublished ? 1 : 0); }
    if (dto.isFreePreview !== undefined) { sets.push('isFreePreview = ?'); params.push(dto.isFreePreview ? 1 : 0); }
    if (videoUrl !== undefined) { sets.push('videoUrl = ?'); params.push(videoUrl); }

    if (sets.length > 0) {
      sets.push('updatedAt = NOW()');
      params.push(lectureId);
      await this.db.execute(`UPDATE Lecture SET ${sets.join(', ')} WHERE id = ?`, params);
    }

    return this.db.queryOne<any>(
      'SELECT id, title, position, durationSec, content, isPublished, isFreePreview, videoUrl FROM Lecture WHERE id = ?',
      [lectureId],
    );
  }

  async deleteSection(courseId: string, sectionId: string, userId: string, userRole: UserRole) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const section = await this.db.queryOne<any>(
      'SELECT id FROM Section WHERE id = ? AND courseId = ?',
      [sectionId, courseId],
    );
    if (!section) throw new NotFoundException('Section not found in this course');

    // CASCADE in the schema will delete lectures (and their resources) automatically
    await this.db.execute('DELETE FROM Section WHERE id = ?', [sectionId]);

    return { deleted: true };
  }

  async createResource(
    courseId: string,
    sectionId: string,
    lectureId: string,
    userId: string,
    userRole: UserRole,
    title: string,
    fileUrl: string,
    fileType: string,
    fileSize: number,
  ) {
    await this.assertCourseAccess(courseId, userId, userRole);
    await this.assertLectureInSection(lectureId, sectionId, courseId);

    const result = await this.db.execute(
      `INSERT INTO Resource (title, fileUrl, fileType, fileSize, lectureId, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [title, fileUrl, fileType, fileSize, lectureId],
    );

    return this.db.queryOne<any>(
      'SELECT id, title, fileUrl, fileType, fileSize, createdAt FROM Resource WHERE id = ?',
      [result.insertId],
    );
  }

  async getResources(
    courseId: string,
    sectionId: string,
    lectureId: string,
    userId: string,
    userRole: UserRole,
  ) {
    await this.assertCourseAccess(courseId, userId, userRole);
    await this.assertLectureInSection(lectureId, sectionId, courseId);

    return this.db.query<any>(
      'SELECT id, title, fileUrl, fileType, fileSize, createdAt FROM Resource WHERE lectureId = ? ORDER BY createdAt ASC',
      [lectureId],
    );
  }

  async deleteResource(
    courseId: string,
    sectionId: string,
    lectureId: string,
    resourceId: string,
    userId: string,
    userRole: UserRole,
  ) {
    await this.assertCourseAccess(courseId, userId, userRole);
    await this.assertLectureInSection(lectureId, sectionId, courseId);

    const resource = await this.db.queryOne<any>(
      'SELECT id FROM Resource WHERE id = ? AND lectureId = ?',
      [resourceId, lectureId],
    );
    if (!resource) throw new NotFoundException('Resource not found');

    await this.db.execute('DELETE FROM Resource WHERE id = ?', [resourceId]);

    return { deleted: true };
  }

  private async assertLectureInSection(lectureId: string, sectionId: string, courseId: string): Promise<void> {
    const lecture = await this.db.queryOne<any>(
      `SELECT l.id FROM Lecture l
       JOIN Section s ON l.sectionId = s.id
       WHERE l.id = ? AND l.sectionId = ? AND s.courseId = ?`,
      [lectureId, sectionId, courseId],
    );
    if (!lecture) throw new NotFoundException('Lecture not found in this section');
  }

  private async assertCourseAccess(courseId: string, userId: string, userRole: UserRole): Promise<void> {
    const course = await this.db.queryOne<any>(
      'SELECT id, instructorId FROM Course WHERE id = ?',
      [courseId],
    );
    if (!course) throw new NotFoundException('Course not found');

    if (userRole !== UserRole.ADMIN && course.instructorId !== userId) {
      throw new ForbiddenException('You cannot modify this course');
    }
  }

  private async getCourseWithInstructor(courseId: any) {
    const c = await this.db.queryOne<any>(
      `SELECT c.id, c.title, c.slug, c.description, c.price, c.level, c.thumbnailUrl,
              c.isPublished, c.createdAt, c.updatedAt,
              u.id as iId, u.name as iName, u.email as iEmail
       FROM Course c JOIN User u ON c.instructorId = u.id WHERE c.id = ?`,
      [courseId],
    );
    if (!c) return null;
    return {
      id: c.id, title: c.title, slug: c.slug, description: c.description,
      price: c.price, level: c.level, thumbnailUrl: c.thumbnailUrl,
      isPublished: !!c.isPublished, createdAt: c.createdAt, updatedAt: c.updatedAt,
      instructor: { id: c.iId, name: c.iName, email: c.iEmail },
    };
  }
}
