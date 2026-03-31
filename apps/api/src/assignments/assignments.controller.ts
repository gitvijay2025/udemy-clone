import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';
import { GradeAssignmentDto } from './dto/grade-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.assignmentsService.findByCourse(courseId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Post('course/:courseId')
  create(
    @Param('courseId') courseId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: CreateAssignmentDto,
  ) {
    return this.assignmentsService.create(courseId, userId, role, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.assignmentsService.submit(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/submissions')
  getSubmissions(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.assignmentsService.getSubmissions(id, userId, role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Patch('submissions/:submissionId/grade')
  grade(
    @Param('submissionId') submissionId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: GradeAssignmentDto,
  ) {
    return this.assignmentsService.grade(submissionId, userId, role, dto);
  }
}
