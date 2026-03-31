import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('student')
  getStudentAnalytics(@CurrentUser('sub') userId: string) {
    return this.analyticsService.getStudentAnalytics(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Get('instructor')
  getInstructorAnalytics(@CurrentUser('sub') userId: string) {
    return this.analyticsService.getInstructorAnalytics(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('platform')
  getPlatformAnalytics() {
    return this.analyticsService.getPlatformAnalytics();
  }
}
