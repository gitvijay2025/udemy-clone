import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('validate-coupon')
  validateCoupon(@Body() body: { code: string; courseId?: string }) {
    return this.paymentsService.validateCoupon(body.code, body.courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallet')
  getWallet(@CurrentUser('sub') userId: string) {
    return this.paymentsService.getWallet(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  @Get('revenue')
  getRevenue(@CurrentUser('sub') userId: string) {
    return this.paymentsService.getInstructorRevenue(userId);
  }
}
