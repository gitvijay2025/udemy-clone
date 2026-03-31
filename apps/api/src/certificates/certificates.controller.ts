import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate/:courseId')
  generate(
    @CurrentUser('sub') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.certificatesService.generate(userId, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyCertificates(@CurrentUser('sub') userId: string) {
    return this.certificatesService.getMyCertificates(userId);
  }

  @Get('verify/:id')
  verify(@Param('id') id: string) {
    return this.certificatesService.verify(id);
  }
}
