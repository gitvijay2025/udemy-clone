import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.quizzesService.findByCourse(courseId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.quizzesService.findById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Post('course/:courseId')
  create(
    @Param('courseId') courseId: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: CreateQuizDto,
  ) {
    return this.quizzesService.create(courseId, userId, role, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizzesService.submit(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/attempts')
  getAttempts(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.quizzesService.getAttempts(id, userId);
  }
}
