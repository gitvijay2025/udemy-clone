import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { createReadStream, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DatabaseService } from '../database/database.service';
import { VideoTokenService } from './video-token.service';

@Controller('videos')
export class VideosController {
  constructor(
    private readonly db: DatabaseService,
    private readonly tokenService: VideoTokenService,
  ) {}

  /**
   * GET /api/videos/token/:lectureId
   * Authenticated endpoint — returns a signed, time-limited stream URL.
   * Only enrolled students or the course instructor/admin can get a token.
   */
  @UseGuards(JwtAuthGuard)
  @Get('token/:lectureId')
  async getStreamToken(
    @Param('lectureId') lectureId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: string,
  ) {
    const lectureIdNum = Number(lectureId);
    const userIdNum = Number(userId);

    // Verify the lecture exists and get course info
    const lecture = await this.db.queryOne<any>(
      `SELECT l.id, l.videoUrl, l.isFreePreview, s.courseId, c.instructorId
       FROM Lecture l
       JOIN Section s ON l.sectionId = s.id
       JOIN Course c ON s.courseId = c.id
       WHERE l.id = ?`,
      [lectureIdNum],
    );

    if (!lecture) throw new NotFoundException('Lecture not found');
    if (!lecture.videoUrl) throw new NotFoundException('No video for this lecture');

    // Allow access if: admin, instructor of the course, or enrolled student
    const isAdmin = role === 'ADMIN';
    const isInstructor = Number(lecture.instructorId) === userIdNum;
    const isFreePreview = !!lecture.isFreePreview;

    if (!isAdmin && !isInstructor && !isFreePreview) {
      const enrollment = await this.db.queryOne<any>(
        'SELECT id FROM Enrollment WHERE userId = ? AND courseId = ?',
        [userIdNum, lecture.courseId],
      );
      if (!enrollment) {
        throw new ForbiddenException('You must be enrolled to watch this video');
      }
    }

    const token = this.tokenService.generateToken(userIdNum, lectureIdNum);
    const base = process.env.API_BASE_URL ?? 'http://localhost:3001';
    return {
      streamUrl: `${base}/api/videos/stream/${lectureIdNum}?token=${token}`,
      expiresIn: Number(process.env.VIDEO_TOKEN_TTL_HOURS ?? 4) * 3600,
    };
  }

  /**
   * GET /api/videos/stream/:lectureId?token=xxx
   * Public endpoint (no JWT) — verified via the signed token.
   * Supports HTTP Range requests for seeking.
   */
  @Get('stream/:lectureId')
  async streamVideo(
    @Param('lectureId') lectureId: string,
    @Query('token') token: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!token) throw new BadRequestException('Missing stream token');

    const decoded = this.tokenService.verifyToken(token);
    if (!decoded) throw new ForbiddenException('Invalid or expired stream token');

    if (decoded.lectureId !== Number(lectureId)) {
      throw new ForbiddenException('Token does not match this lecture');
    }

    // Get file path from DB
    const lecture = await this.db.queryOne<any>(
      'SELECT videoUrl FROM Lecture WHERE id = ?',
      [decoded.lectureId],
    );
    if (!lecture?.videoUrl) throw new NotFoundException('Video not found');

    // Extract filename from videoUrl (e.g. http://localhost:3001/uploads/videos/xxx.mp4 → xxx.mp4)
    const filename = lecture.videoUrl.split('/').pop();
    if (!filename) throw new NotFoundException('Video file not found');

    const filePath = join(process.cwd(), 'uploads', 'videos', filename);

    let stat;
    try {
      stat = statSync(filePath);
    } catch {
      throw new NotFoundException('Video file not found on disk');
    }

    const fileSize = stat.size;
    const ext = extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
    };
    const contentType = mimeTypes[ext] || 'video/mp4';

    // Security headers — prevent download
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Accept-Ranges', 'bytes');

    // Handle Range requests (essential for video seeking)
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunkSize);
      res.setHeader('Content-Type', contentType);

      const stream = createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      res.status(200);
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Type', contentType);

      const stream = createReadStream(filePath);
      stream.pipe(res);
    }
  }
}
