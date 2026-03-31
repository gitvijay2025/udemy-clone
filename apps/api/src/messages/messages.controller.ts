import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';
import { ComposeMessageDto, ReplyMessageDto } from './dto/send-message.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /** GET /api/messages/inbox — received messages (top-level only) */
  @Get('inbox')
  getInbox(@CurrentUser('sub') userId: string) {
    return this.messagesService.getInbox(userId);
  }

  /** GET /api/messages/sent — sent messages (top-level only) */
  @Get('sent')
  getSent(@CurrentUser('sub') userId: string) {
    return this.messagesService.getSent(userId);
  }

  /** GET /api/messages/unread-count — count of unread messages */
  @Get('unread-count')
  getUnreadCount(@CurrentUser('sub') userId: string) {
    return this.messagesService.getUnreadCount(userId);
  }

  /** GET /api/messages/:id — single message with its reply thread */
  @Get(':id')
  getMessage(
    @CurrentUser('sub') userId: string,
    @Param('id') messageId: string,
  ) {
    return this.messagesService.getMessage(userId, messageId);
  }

  /** POST /api/messages — compose a new message */
  @Post()
  compose(
    @CurrentUser() user: { sub: string; role: string },
    @Body() dto: ComposeMessageDto,
  ) {
    return this.messagesService.compose(user.sub, user.role, dto);
  }

  /** POST /api/messages/:id/reply — reply to a message */
  @Post(':id/reply')
  reply(
    @CurrentUser('sub') userId: string,
    @Param('id') messageId: string,
    @Body() dto: ReplyMessageDto,
  ) {
    return this.messagesService.reply(userId, messageId, dto);
  }

  /** PATCH /api/messages/:id/read — mark a message as read */
  @Patch(':id/read')
  markRead(
    @CurrentUser('sub') userId: string,
    @Param('id') messageId: string,
  ) {
    return this.messagesService.markRead(userId, messageId);
  }
}
