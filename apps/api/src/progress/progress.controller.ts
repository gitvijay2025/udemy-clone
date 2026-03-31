import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('course/:courseId')
  getCourseProgress(
    @CurrentUser('sub') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.getCourseProgress(userId, courseId);
  }

  @Patch('lecture/:lectureId')
  updateLectureProgress(
    @CurrentUser('sub') userId: string,
    @Param('lectureId') lectureId: string,
    @Body() body: { completed?: boolean; watchedSec?: number },
  ) {
    return this.progressService.updateLectureProgress(userId, lectureId, body);
  }
}
