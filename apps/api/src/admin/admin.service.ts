import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CourseStatus, UserRole } from '../common/enums';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  // ─── Users ──────────────────────────────────────────────────────────────────

  async getUsers(page = 1, limit = 20, search?: string) {
    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push('(u.name LIKE ? OR u.email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const users = await this.db.query<any>(
      `SELECT u.id, u.email, u.name, u.role, u.emailVerified, u.isApprovedInstructor, u.createdAt,
              (SELECT COUNT(*) FROM Course c WHERE c.instructorId = u.id) as courseCount,
              (SELECT COUNT(*) FROM Enrollment e WHERE e.userId = u.id) as enrollmentCount
       FROM User u ${whereClause}
       ORDER BY u.createdAt DESC
       LIMIT ${Number(limit)} OFFSET ${Number((page - 1) * limit)}`,
      params,
    );

    const countResult = await this.db.queryOne<any>(
      `SELECT COUNT(*) as total FROM User u ${whereClause}`,
      params,
    );
    const total = Number(countResult?.total ?? 0);

    return {
      users: users.map((u: any) => ({
        ...u,
        emailVerified: !!u.emailVerified,
        isApprovedInstructor: !!u.isApprovedInstructor,
        _count: { courses: Number(u.courseCount), enrollments: Number(u.enrollmentCount) },
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserRole(userId: string, role: UserRole) {
    const user = await this.db.queryOne<any>('SELECT id FROM User WHERE id = ?', [userId]);
    if (!user) throw new NotFoundException('User not found');

    await this.db.execute(
      'UPDATE User SET role = ?, updatedAt = NOW() WHERE id = ?',
      [role, userId],
    );
    return this.db.queryOne('SELECT id, email, name, role FROM User WHERE id = ?', [userId]);
  }

  async banUser(userId: string) {
    await this.db.execute(
      "UPDATE User SET role = 'STUDENT', isApprovedInstructor = 0, updatedAt = NOW() WHERE id = ?",
      [userId],
    );
    return this.db.queryOne('SELECT * FROM User WHERE id = ?', [userId]);
  }

  async approveInstructor(userId: string) {
    await this.db.execute(
      "UPDATE User SET isApprovedInstructor = 1, role = 'INSTRUCTOR', updatedAt = NOW() WHERE id = ?",
      [userId],
    );
    return this.db.queryOne('SELECT * FROM User WHERE id = ?', [userId]);
  }

  // ─── Course Moderation ──────────────────────────────────────────────────────

  async getPendingCourses() {
    const courses = await this.db.query<any>(
      `SELECT c.*, u.id as iId, u.name as iName, u.email as iEmail,
              (SELECT COUNT(*) FROM Section s WHERE s.courseId = c.id) as sectionCount,
              (SELECT COUNT(*) FROM Enrollment e WHERE e.courseId = c.id) as enrollmentCount
       FROM Course c JOIN User u ON c.instructorId = u.id
       WHERE c.status = ?
       ORDER BY c.createdAt DESC`,
      [CourseStatus.PENDING_REVIEW],
    );

    return courses.map((c: any) => ({
      ...c,
      isPublished: !!c.isPublished,
      instructor: { id: c.iId, name: c.iName, email: c.iEmail },
      _count: { sections: Number(c.sectionCount), enrollments: Number(c.enrollmentCount) },
    }));
  }

  async getAllCourses(page = 1, limit = 20, search?: string) {
    const conditions: string[] = [];
    const params: any[] = [];
    if (search) {
      conditions.push('c.title LIKE ?');
      params.push(`%${search}%`);
    }
    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const courses = await this.db.query<any>(
      `SELECT c.*, u.id as iId, u.name as iName,
              (SELECT COUNT(*) FROM Enrollment e WHERE e.courseId = c.id) as enrollmentCount,
              (SELECT COUNT(*) FROM Review r WHERE r.courseId = c.id) as reviewCount,
              (SELECT COUNT(*) FROM Section s WHERE s.courseId = c.id) as sectionCount
       FROM Course c JOIN User u ON c.instructorId = u.id
       ${whereClause}
       ORDER BY c.createdAt DESC
       LIMIT ${Number(limit)} OFFSET ${Number((page - 1) * limit)}`,
      params,
    );

    const countResult = await this.db.queryOne<any>(
      `SELECT COUNT(*) as total FROM Course c ${whereClause}`,
      params,
    );
    const total = Number(countResult?.total ?? 0);

    return {
      courses: courses.map((c: any) => ({
        ...c,
        isPublished: !!c.isPublished,
        instructor: { id: c.iId, name: c.iName },
        _count: {
          enrollments: Number(c.enrollmentCount),
          reviews: Number(c.reviewCount),
          sections: Number(c.sectionCount),
        },
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCourseDetail(courseId: string) {
    const course = await this.db.queryOne<any>(
      `SELECT c.*, u.id as iId, u.name as iName, u.email as iEmail,
              cat.id as catId, cat.name as catName, cat.slug as catSlug
       FROM Course c
       JOIN User u ON c.instructorId = u.id
       LEFT JOIN Category cat ON c.categoryId = cat.id
       WHERE c.id = ?`,
      [courseId],
    );
    if (!course) throw new NotFoundException('Course not found');

    const reviewStats = await this.db.queryOne<any>(
      'SELECT COUNT(*) as cnt, COALESCE(AVG(rating), 0) as avg FROM Review WHERE courseId = ?',
      [courseId],
    );
    const enrollmentCount = await this.db.queryOne<any>(
      'SELECT COUNT(*) as cnt FROM Enrollment WHERE courseId = ?',
      [courseId],
    );

    const sections = await this.db.query<any>(
      'SELECT id, title, position, isPublished, createdAt FROM Section WHERE courseId = ? ORDER BY position ASC',
      [courseId],
    );
    for (const section of sections) {
      section.isPublished = !!section.isPublished;
      section.lectures = await this.db.query<any>(
        `SELECT id, title, position, isPublished, isFreePreview, durationSec, content, videoUrl
         FROM Lecture WHERE sectionId = ? ORDER BY position ASC`,
        [section.id],
      );
      section.lectures.forEach((l: any) => {
        l.isPublished = !!l.isPublished;
        l.isFreePreview = !!l.isFreePreview;
        l.hasVideo = !!l.videoUrl;
      });
    }

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      price: course.price,
      level: course.level,
      language: course.language,
      status: course.status,
      thumbnailUrl: course.thumbnailUrl,
      previewVideoUrl: course.previewVideoUrl,
      requirements: course.requirements,
      targetAudience: course.targetAudience,
      isPublished: !!course.isPublished,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      instructor: { id: course.iId, name: course.iName, email: course.iEmail },
      category: course.catId
        ? { id: course.catId, name: course.catName, slug: course.catSlug }
        : null,
      averageRating: Number(reviewStats?.avg ?? 0),
      _count: {
        enrollments: Number(enrollmentCount?.cnt ?? 0),
        reviews: Number(reviewStats?.cnt ?? 0),
        sections: sections.length,
        lectures: sections.reduce((acc: number, s: any) => acc + s.lectures.length, 0),
      },
      sections,
    };
  }

  async approveCourse(courseId: string) {
    await this.db.execute(
      'UPDATE Course SET status = ?, isPublished = 1, updatedAt = NOW() WHERE id = ?',
      [CourseStatus.APPROVED, courseId],
    );
    return this.db.queryOne('SELECT * FROM Course WHERE id = ?', [courseId]);
  }

  async rejectCourse(courseId: string) {
    await this.db.execute(
      'UPDATE Course SET status = ?, isPublished = 0, updatedAt = NOW() WHERE id = ?',
      [CourseStatus.REJECTED, courseId],
    );
    return this.db.queryOne('SELECT * FROM Course WHERE id = ?', [courseId]);
  }

  // ─── Coupons ────────────────────────────────────────────────────────────────

  async getCoupons() {
    const coupons = await this.db.query<any>(
      `SELECT cp.*, c.id as cId, c.title as cTitle,
              (SELECT COUNT(*) FROM \`Order\` o WHERE o.couponId = cp.id) as orderCount
       FROM Coupon cp
       LEFT JOIN Course c ON cp.courseId = c.id
       ORDER BY cp.createdAt DESC`,
    );

    return coupons.map((cp: any) => ({
      ...cp,
      isActive: !!cp.isActive,
      course: cp.cId ? { id: cp.cId, title: cp.cTitle } : null,
      _count: { orders: Number(cp.orderCount) },
    }));
  }

  async createCoupon(data: {
    code: string;
    discountPercent: number;
    maxUses?: number;
    courseId?: string;
    expiresAt?: string;
  }) {
    const result = await this.db.execute(
      `INSERT INTO Coupon (code, discountPercent, maxUses, courseId, expiresAt, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        data.code.toUpperCase(),
        data.discountPercent,
        data.maxUses ?? null,
        data.courseId ?? null,
        data.expiresAt ? new Date(data.expiresAt) : null,
      ],
    );
    return this.db.queryOne('SELECT * FROM Coupon WHERE id = ?', [result.insertId]);
  }

  async deleteCoupon(id: string) {
    await this.db.execute('DELETE FROM Coupon WHERE id = ?', [id]);
    return { deleted: true };
  }

  // ─── Dashboard Stats ──────────────────────────────────────────────────────

  async getDashboardStats() {
    const [
      totalUsersResult,
      totalCoursesResult,
      totalEnrollmentsResult,
      totalRevenueResult,
      totalOrdersResult,
    ] = await Promise.all([
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM User'),
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM Course'),
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM Enrollment'),
      this.db.queryOne<any>("SELECT COALESCE(SUM(totalAmount), 0) as total FROM `Order` WHERE status = 'COMPLETED'"),
      this.db.queryOne<any>("SELECT COUNT(*) as cnt FROM `Order` WHERE status = 'COMPLETED'"),
    ]);

    const recentUsers = await this.db.query<any>(
      'SELECT id, name, email, role, createdAt FROM User ORDER BY createdAt DESC LIMIT 5',
    );

    const recentEnrollments = await this.db.query<any>(
      `SELECT e.*, u.name as userName, c.title as courseTitle
       FROM Enrollment e
       JOIN User u ON e.userId = u.id
       JOIN Course c ON e.courseId = c.id
       ORDER BY e.enrolledAt DESC LIMIT 5`,
    );

    const usersByRole = await this.db.query<any>(
      'SELECT role, COUNT(*) as _count FROM User GROUP BY role',
    );

    return {
      totalUsers: Number(totalUsersResult?.cnt ?? 0),
      totalCourses: Number(totalCoursesResult?.cnt ?? 0),
      totalEnrollments: Number(totalEnrollmentsResult?.cnt ?? 0),
      totalOrders: Number(totalOrdersResult?.cnt ?? 0),
      totalRevenue: Number(totalRevenueResult?.total ?? 0),
      usersByRole,
      recentUsers,
      recentEnrollments: recentEnrollments.map((e: any) => ({
        ...e,
        user: { name: e.userName },
        course: { title: e.courseTitle },
      })),
    };
  }
}
