import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post(':courseId')
  enroll(
    @CurrentUser('sub') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.enrollmentsService.enroll(userId, courseId);
  }

  @Get('me')
  myLearning(@CurrentUser('sub') userId: string) {
    return this.enrollmentsService.myLearning(userId);
  }
}
