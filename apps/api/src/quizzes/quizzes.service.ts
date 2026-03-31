import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UserRole } from '../common/enums';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private readonly db: DatabaseService) {}

  async create(courseId: string, userId: string, userRole: UserRole, dto: CreateQuizDto) {
    await this.assertCourseAccess(courseId, userId, userRole);

    const quizResult = await this.db.execute(
      `INSERT INTO Quiz (title, description, courseId, passingScore, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [dto.title, dto.description ?? null, courseId, dto.passingScore ?? 70],
    );
    const quizId = quizResult.insertId;

    for (const q of dto.questions) {
      const questionResult = await this.db.execute(
        `INSERT INTO QuizQuestion (quizId, question, type, points, position, createdAt)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [quizId, q.question, q.type ?? 'MULTIPLE_CHOICE', q.points ?? 1, q.position],
      );
      const questionId = questionResult.insertId;

      if (q.options) {
        for (const o of q.options) {
          await this.db.execute(
            'INSERT INTO QuizOption (questionId, text, isCorrect) VALUES (?, ?, ?)',
            [questionId, o.text, o.isCorrect ? 1 : 0],
          );
        }
      }
    }

    return this.getQuizWithQuestions(quizId);
  }

  async findByCourse(courseId: string) {
    const quizzes = await this.db.query<any>(
      'SELECT * FROM Quiz WHERE courseId = ? ORDER BY createdAt ASC',
      [courseId],
    );

    for (const quiz of quizzes) {
      const attemptCount = await this.db.queryOne<any>(
        'SELECT COUNT(*) as cnt FROM QuizAttempt WHERE quizId = ?',
        [quiz.id],
      );
      quiz._count = { attempts: Number(attemptCount?.cnt ?? 0) };

      quiz.questions = await this.db.query<any>(
        'SELECT * FROM QuizQuestion WHERE quizId = ? ORDER BY position ASC',
        [quiz.id],
      );
      for (const q of quiz.questions) {
        q.options = await this.db.query<any>(
          'SELECT id, text FROM QuizOption WHERE questionId = ?',
          [q.id],
        );
      }
    }

    return quizzes;
  }

  async findById(quizId: string) {
    const quiz = await this.db.queryOne<any>('SELECT * FROM Quiz WHERE id = ?', [quizId]);
    if (!quiz) throw new NotFoundException('Quiz not found');

    quiz.questions = await this.db.query<any>(
      'SELECT * FROM QuizQuestion WHERE quizId = ? ORDER BY position ASC',
      [quiz.id],
    );
    for (const q of quiz.questions) {
      q.options = await this.db.query<any>(
        'SELECT id, text FROM QuizOption WHERE questionId = ?',
        [q.id],
      );
    }

    return quiz;
  }

  async submit(quizId: string, userId: string, dto: SubmitQuizDto) {
    const quiz = await this.db.queryOne<any>('SELECT * FROM Quiz WHERE id = ?', [quizId]);
    if (!quiz) throw new NotFoundException('Quiz not found');

    const questions = await this.db.query<any>(
      'SELECT * FROM QuizQuestion WHERE quizId = ?',
      [quizId],
    );

    for (const q of questions) {
      q.options = await this.db.query<any>(
        'SELECT * FROM QuizOption WHERE questionId = ?',
        [q.id],
      );
    }

    let totalPoints = 0;
    let earnedPoints = 0;

    const answerRecords = dto.answers.map((a) => {
      const question = questions.find((q: any) => q.id === a.questionId);
      if (!question) return { questionId: a.questionId, answer: a.answer, isCorrect: false };

      totalPoints += question.points;
      let isCorrect = false;

      if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
        const correctOption = question.options.find((o: any) => o.isCorrect);
        isCorrect =
          correctOption?.id === a.answer ||
          correctOption?.text.toLowerCase() === a.answer.toLowerCase();
      } else {
        isCorrect = question.options.some(
          (o: any) => o.isCorrect && o.text.toLowerCase().trim() === a.answer.toLowerCase().trim(),
        );
      }

      if (isCorrect) earnedPoints += question.points;

      return { questionId: a.questionId, answer: a.answer, isCorrect };
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;

    const attemptResult = await this.db.execute(
      `INSERT INTO QuizAttempt (userId, quizId, score, passed, completedAt)
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, quizId, score, passed ? 1 : 0],
    );
    const attemptId = attemptResult.insertId;

    for (const ar of answerRecords) {
      await this.db.execute(
        'INSERT INTO QuizAnswer (attemptId, questionId, answer, isCorrect) VALUES (?, ?, ?, ?)',
        [attemptId, ar.questionId, ar.answer, ar.isCorrect ? 1 : 0],
      );
    }

    const attempt = await this.db.queryOne<any>('SELECT * FROM QuizAttempt WHERE id = ?', [attemptId]);
    const answers = await this.db.query<any>('SELECT * FROM QuizAnswer WHERE attemptId = ?', [attemptId]);

    return { attempt: { ...attempt, answers }, score, passed, totalPoints, earnedPoints };
  }

  async getAttempts(quizId: string, userId: string) {
    const attempts = await this.db.query<any>(
      'SELECT * FROM QuizAttempt WHERE quizId = ? AND userId = ? ORDER BY completedAt DESC',
      [quizId, userId],
    );
    for (const attempt of attempts) {
      attempt.answers = await this.db.query<any>(
        'SELECT * FROM QuizAnswer WHERE attemptId = ?',
        [attempt.id],
      );
    }
    return attempts;
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

  private async getQuizWithQuestions(quizId: any) {
    const quiz = await this.db.queryOne<any>('SELECT * FROM Quiz WHERE id = ?', [quizId]);
    if (!quiz) return null;

    quiz.questions = await this.db.query<any>(
      'SELECT * FROM QuizQuestion WHERE quizId = ? ORDER BY position ASC',
      [quiz.id],
    );
    for (const q of quiz.questions) {
      q.options = await this.db.query<any>(
        'SELECT * FROM QuizOption WHERE questionId = ?',
        [q.id],
      );
    }
    return quiz;
  }
}
