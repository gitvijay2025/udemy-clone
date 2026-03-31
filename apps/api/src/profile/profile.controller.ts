import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@CurrentUser('sub') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @CurrentUser('sub') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(userId, dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.profileService.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.profileService.resetPassword(body.token, body.newPassword);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: { token: string }) {
    return this.profileService.verifyEmail(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('two-factor')
  toggleTwoFactor(
    @CurrentUser('sub') userId: string,
    @Body() body: { enable: boolean },
  ) {
    return this.profileService.toggleTwoFactor(userId, body.enable);
  }
}
