import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly db: DatabaseService) {}

  async getInstructorAnalytics(instructorId: string) {
    const courses = await this.db.query<any>(
      `SELECT c.id, c.title, c.slug, c.price, c.createdAt,
              (SELECT COUNT(*) FROM Enrollment e WHERE e.courseId = c.id) as enrollmentCount,
              (SELECT COUNT(*) FROM Review r WHERE r.courseId = c.id) as reviewCount,
              (SELECT AVG(r.rating) FROM Review r WHERE r.courseId = c.id) as avgRating
       FROM Course c WHERE c.instructorId = ?`,
      [instructorId],
    );

    const courseStats = courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      price: Number(c.price),
      students: Number(c.enrollmentCount),
      reviewCount: Number(c.reviewCount),
      averageRating: c.avgRating ? Math.round(Number(c.avgRating) * 10) / 10 : 0,
      revenue: Number(c.price) * Number(c.enrollmentCount) * 0.7,
      createdAt: c.createdAt,
    }));

    const totalStudents = courseStats.reduce((s, c) => s + c.students, 0);
    const totalRevenue = courseStats.reduce((s, c) => s + c.revenue, 0);
    const totalReviews = courseStats.reduce((s, c) => s + c.reviewCount, 0);

    return {
      courses: courseStats,
      totals: {
        courses: courses.length,
        students: totalStudents,
        revenue: totalRevenue,
        reviews: totalReviews,
      },
    };
  }

  async getPlatformAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsersRes,
      newUsersRes,
      totalCoursesRes,
      totalEnrollmentsRes,
      newEnrollmentsRes,
      completedOrdersRes,
      revenueRes,
      completedEnrollmentsRes,
    ] = await Promise.all([
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM User'),
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM User WHERE createdAt >= ?', [thirtyDaysAgo]),
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM Course WHERE isPublished = 1'),
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM Enrollment'),
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM Enrollment WHERE enrolledAt >= ?', [thirtyDaysAgo]),
      this.db.queryOne<any>("SELECT COUNT(*) as cnt FROM `Order` WHERE status = 'COMPLETED'"),
      this.db.queryOne<any>("SELECT COALESCE(SUM(totalAmount), 0) as total FROM `Order` WHERE status = 'COMPLETED'"),
      this.db.queryOne<any>('SELECT COUNT(*) as cnt FROM Enrollment WHERE completedAt IS NOT NULL'),
    ]);

    const totalEnrollments = Number(totalEnrollmentsRes?.cnt ?? 0);
    const completedEnrollments = Number(completedEnrollmentsRes?.cnt ?? 0);

    const topCourses = await this.db.query<any>(
      `SELECT c.id, c.title, c.slug,
              (SELECT COUNT(*) FROM Enrollment e WHERE e.courseId = c.id) as enrollmentCount,
              (SELECT COUNT(*) FROM Review r WHERE r.courseId = c.id) as reviewCount,
              (SELECT AVG(r.rating) FROM Review r WHERE r.courseId = c.id) as avgRating
       FROM Course c WHERE c.isPublished = 1
       ORDER BY enrollmentCount DESC LIMIT 10`,
    );

    const usersByRole = await this.db.query<any>(
      'SELECT role, COUNT(*) as _count FROM User GROUP BY role',
    );

    return {
      overview: {
        totalUsers: Number(totalUsersRes?.cnt ?? 0),
        newUsers30d: Number(newUsersRes?.cnt ?? 0),
        totalCourses: Number(totalCoursesRes?.cnt ?? 0),
        totalEnrollments,
        newEnrollments30d: Number(newEnrollmentsRes?.cnt ?? 0),
        completedOrders: Number(completedOrdersRes?.cnt ?? 0),
        totalRevenue: Number(revenueRes?.total ?? 0),
        completionRate: totalEnrollments > 0
          ? Math.round((completedEnrollments / totalEnrollments) * 100)
          : 0,
      },
      topCourses: topCourses.map((c: any) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        enrollments: Number(c.enrollmentCount),
        reviews: Number(c.reviewCount),
        avgRating: c.avgRating ? Math.round(Number(c.avgRating) * 10) / 10 : 0,
      })),
      usersByRole,
    };
  }

  async getStudentAnalytics(userId: string) {
    const enrollments = await this.db.query<any>(
      `SELECT e.*, c.id as cId, c.title as cTitle, c.slug as cSlug
       FROM Enrollment e JOIN Course c ON e.courseId = c.id
       WHERE e.userId = ?`,
      [userId],
    );

    const completed = enrollments.filter((e: any) => e.completedAt !== null).length;
    const inProgress = enrollments.filter(
      (e: any) => e.completedAt === null && e.progress > 0,
    ).length;

    const quizAttempts = await this.db.query<any>(
      'SELECT score, passed FROM QuizAttempt WHERE userId = ?',
      [userId],
    );

    const avgQuizScore =
      quizAttempts.length > 0
        ? Math.round(quizAttempts.reduce((s: number, a: any) => s + a.score, 0) / quizAttempts.length)
        : 0;

    return {
      totalEnrolled: enrollments.length,
      completed,
      inProgress,
      avgProgress: enrollments.length > 0
        ? Math.round(enrollments.reduce((s: number, e: any) => s + e.progress, 0) / enrollments.length)
        : 0,
      avgQuizScore,
      quizzesTaken: quizAttempts.length,
      quizzesPassed: quizAttempts.filter((a: any) => a.passed).length,
      enrollments: enrollments.map((e: any) => ({
        ...e,
        course: { id: e.cId, title: e.cTitle, slug: e.cSlug },
      })),
    };
  }
}
