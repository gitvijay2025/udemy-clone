import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../common/enums';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  // ─── Users ──────────────────────────────────────────────────────────────────

  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(
      Number(page) || 1,
      Number(limit) || 20,
      search,
    );
  }

  @Patch('users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: UserRole },
  ) {
    return this.adminService.updateUserRole(id, body.role);
  }

  @Patch('users/:id/ban')
  banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }

  @Patch('users/:id/approve-instructor')
  approveInstructor(@Param('id') id: string) {
    return this.adminService.approveInstructor(id);
  }

  // ─── Courses ────────────────────────────────────────────────────────────────

  @Get('courses')
  getCourses(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllCourses(
      Number(page) || 1,
      Number(limit) || 20,
      search,
    );
  }

  @Get('courses/pending')
  getPendingCourses() {
    return this.adminService.getPendingCourses();
  }

  @Get('courses/:id')
  getCourseDetail(@Param('id') id: string) {
    return this.adminService.getCourseDetail(id);
  }

  @Patch('courses/:id/approve')
  approveCourse(@Param('id') id: string) {
    return this.adminService.approveCourse(id);
  }

  @Patch('courses/:id/reject')
  rejectCourse(@Param('id') id: string) {
    return this.adminService.rejectCourse(id);
  }

  // ─── Coupons ────────────────────────────────────────────────────────────────

  @Get('coupons')
  getCoupons() {
    return this.adminService.getCoupons();
  }

  @Post('coupons')
  createCoupon(
    @Body()
    body: {
      code: string;
      discountPercent: number;
      maxUses?: number;
      courseId?: string;
      expiresAt?: string;
    },
  ) {
    return this.adminService.createCoupon(body);
  }

  @Delete('coupons/:id')
  deleteCoupon(@Param('id') id: string) {
    return this.adminService.deleteCoupon(id);
  }
}
