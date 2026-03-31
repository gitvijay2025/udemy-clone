import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideoTokenService } from './video-token.service';

@Module({
  controllers: [VideosController],
  providers: [VideoTokenService],
  exports: [VideoTokenService],
})
export class VideosModule {}
