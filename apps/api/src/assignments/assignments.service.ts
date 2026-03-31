import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UserRole } from '../common/enums';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly db: DatabaseService) {}

  async create(courseId: string, userId: string, userRole: UserRole, dto: CreateAssignmentDto) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const result = await this.db.execute(
      `INSERT INTO Assignment (title, description, courseId, dueDate, maxScore, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [dto.title, dto.description, courseId, dto.dueDate ? new Date(dto.dueDate) : null, dto.maxScore ?? 100],
    );

    return this.db.queryOne('SELECT * FROM Assignment WHERE id = ?', [result.insertId]);
  }

  async findByCourse(courseId: string) {
    const assignments = await this.db.query<any>(
      'SELECT * FROM Assignment WHERE courseId = ? ORDER BY createdAt DESC',
      [courseId],
    );

    for (const a of assignments) {
      const subCount = await this.db.queryOne<any>(
        'SELECT COUNT(*) as cnt FROM AssignmentSubmission WHERE assignmentId = ?',
        [a.id],
      );
      a._count = { submissions: Number(subCount?.cnt ?? 0) };
    }

    return assignments;
  }

  async submit(assignmentId: string, userId: string, dto: SubmitAssignmentDto) {
    const assignment = await this.db.queryOne<any>(
      'SELECT id FROM Assignment WHERE id = ?',
      [assignmentId],
    );
    if (!assignment) throw new NotFoundException('Assignment not found');

    const existing = await this.db.queryOne<any>(
      'SELECT id FROM AssignmentSubmission WHERE assignmentId = ? AND userId = ?',
      [assignmentId, userId],
    );

    if (existing) {
      await this.db.execute(
        'UPDATE AssignmentSubmission SET content = ?, fileUrl = ?, submittedAt = NOW() WHERE id = ?',
        [dto.content, dto.fileUrl ?? null, existing.id],
      );
      return this.db.queryOne('SELECT * FROM AssignmentSubmission WHERE id = ?', [existing.id]);
    }

    const result = await this.db.execute(
      `INSERT INTO AssignmentSubmission (assignmentId, userId, content, fileUrl, submittedAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [assignmentId, userId, dto.content, dto.fileUrl ?? null],
    );
    return this.db.queryOne('SELECT * FROM AssignmentSubmission WHERE id = ?', [result.insertId]);
  }

  async getSubmissions(assignmentId: string, userId: string, userRole: UserRole) {
    const assignment = await this.db.queryOne<any>(
      `SELECT a.id, c.instructorId
       FROM Assignment a JOIN Course c ON a.courseId = c.id
       WHERE a.id = ?`,
      [assignmentId],
    );
    if (!assignment) throw new NotFoundException('Assignment not found');

    if (userRole === UserRole.ADMIN || assignment.instructorId === userId) {
      const submissions = await this.db.query<any>(
        `SELECT s.*, u.id as uId, u.name as uName, u.email as uEmail
         FROM AssignmentSubmission s
         JOIN User u ON s.userId = u.id
         WHERE s.assignmentId = ?
         ORDER BY s.submittedAt DESC`,
        [assignmentId],
      );
      return submissions.map((s: any) => ({
        id: s.id, assignmentId: s.assignmentId, userId: s.userId,
        content: s.content, fileUrl: s.fileUrl, score: s.score,
        feedback: s.feedback, submittedAt: s.submittedAt, gradedAt: s.gradedAt,
        user: { id: s.uId, name: s.uName, email: s.uEmail },
      }));
    }

    return this.db.query(
      'SELECT * FROM AssignmentSubmission WHERE assignmentId = ? AND userId = ?',
      [assignmentId, userId],
    );
  }

  async grade(submissionId: string, userId: string, userRole: UserRole, dto: GradeAssignmentDto) {
    const submission = await this.db.queryOne<any>(
      `SELECT s.id, c.instructorId
       FROM AssignmentSubmission s
       JOIN Assignment a ON s.assignmentId = a.id
       JOIN Course c ON a.courseId = c.id
       WHERE s.id = ?`,
      [submissionId],
    );
    if (!submission) throw new NotFoundException('Submission not found');

    if (userRole !== UserRole.ADMIN && submission.instructorId !== userId) {
      throw new ForbiddenException('Only the instructor can grade');
    }

    await this.db.execute(
      'UPDATE AssignmentSubmission SET score = ?, feedback = ?, gradedAt = NOW() WHERE id = ?',
      [dto.score, dto.feedback ?? null, submissionId],
    );

    return this.db.queryOne('SELECT * FROM AssignmentSubmission WHERE id = ?', [submissionId]);
  }

  private async assertCourseAccess(courseId: string, userId: string, userRole: UserRole) {
    const course = await this.db.queryOne<any>(
      'SELECT instructorId FROM Course WHERE id = ?',
      [courseId],
    );
    if (!course) throw new NotFoundException('Course not found');
    if (userRole !== UserRole.ADMIN && course.instructorId !== userId) {
      throw new ForbiddenException('You cannot modify this course');
    }
  }
}
