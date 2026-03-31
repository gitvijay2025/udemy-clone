import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';
import { mkdirSync } from 'node:fs';
import { CourseLevel, UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  private buildVideoUrl(filename: string): string {
    const base = process.env.API_BASE_URL ?? 'http://localhost:3001';
    return `${base}/uploads/videos/${filename}`;
  }

  @Get()
  listPublished(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('level') level?: CourseLevel,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('language') language?: string,
    @Query('sort') sort?: 'newest' | 'popular' | 'price_asc' | 'price_desc' | 'rating',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.coursesService.findPublished({
      search,
      category,
      level,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      language,
      sort,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Get('instructor/mine')
  myCourses(@CurrentUser('sub') userId: string) {
    return this.coursesService.findInstructorCourses(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Get('instructor/:id')
  getInstructorCourseById(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.coursesService.findInstructorCourseById(id, userId, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCourseDto,
  ) {
    return this.coursesService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, userId, role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Patch(':id/publish')
  publish(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.coursesService.publish(id, userId, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Post(':id/sections')
  addSection(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: CreateSectionDto,
  ) {
    return this.coursesService.createSection(id, userId, role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Patch(':courseId/sections/:sectionId')
  editSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.coursesService.updateSection(
      courseId,
      sectionId,
      userId,
      role,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Post(':courseId/sections/:sectionId/lectures')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          const destination = join(process.cwd(), 'uploads', 'videos');
          mkdirSync(destination, { recursive: true });
          callback(null, destination);
        },
        filename: (_request, file, callback) => {
          const ext = extname(file.originalname || '') || '.mp4';
          const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          callback(null, safe);
        },
      }),
      fileFilter: (_request, file, callback) => {
        const ok = file.mimetype.startsWith('video/');
        callback(null, ok);
      },
      limits: {
        fileSize: 1024 * 1024 * 500,
      },
    }),
  )
  uploadLectureVideo(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: CreateLectureDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.coursesService.createLecture(
      courseId,
      sectionId,
      userId,
      role,
      dto,
      this.buildVideoUrl(file.filename),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Patch(':courseId/sections/:sectionId/lectures/:lectureId')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          const destination = join(process.cwd(), 'uploads', 'videos');
          mkdirSync(destination, { recursive: true });
          callback(null, destination);
        },
        filename: (_request, file, callback) => {
          const ext = extname(file.originalname || '') || '.mp4';
          const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          callback(null, safe);
        },
      }),
      fileFilter: (_request, file, callback) => {
        const ok = file.mimetype.startsWith('video/');
        callback(null, ok);
      },
      limits: {
        fileSize: 1024 * 1024 * 500,
      },
    }),
  )
  updateLecture(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('lectureId') lectureId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: UpdateLectureDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.coursesService.updateLecture(
      courseId,
      sectionId,
      lectureId,
      userId,
      role,
      dto,
      file ? this.buildVideoUrl(file.filename) : undefined,
    );
  }

  /* ── Delete section (topic) ── */

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Delete(':courseId/sections/:sectionId')
  deleteSection(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.coursesService.deleteSection(courseId, sectionId, userId, role);
  }

  /* ── Lecture resources ── */

  private buildResourceUrl(filename: string): string {
    const base = process.env.API_BASE_URL ?? 'http://localhost:3001';
    return `${base}/uploads/resources/${filename}`;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Post(':courseId/sections/:sectionId/lectures/:lectureId/resources')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          const destination = join(process.cwd(), 'uploads', 'resources');
          mkdirSync(destination, { recursive: true });
          callback(null, destination);
        },
        filename: (_request, file, callback) => {
          const ext = extname(file.originalname || '') || '.bin';
          const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          callback(null, safe);
        },
      }),
      fileFilter: (_request, file, callback) => {
        const allowed = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/webp',
        ];
        callback(null, allowed.includes(file.mimetype));
      },
      limits: {
        fileSize: 1024 * 1024 * 50, // 50 MB
      },
    }),
  )
  uploadResource(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('lectureId') lectureId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body('title') title: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coursesService.createResource(
      courseId,
      sectionId,
      lectureId,
      userId,
      role,
      title || file.originalname,
      this.buildResourceUrl(file.filename),
      file.mimetype,
      file.size,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Get(':courseId/sections/:sectionId/lectures/:lectureId/resources')
  listResources(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('lectureId') lectureId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.coursesService.getResources(courseId, sectionId, lectureId, userId, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Delete(':courseId/sections/:sectionId/lectures/:lectureId/resources/:resourceId')
  deleteResource(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('lectureId') lectureId: string,
    @Param('resourceId') resourceId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.coursesService.deleteResource(courseId, sectionId, lectureId, resourceId, userId, role);
  }
}
