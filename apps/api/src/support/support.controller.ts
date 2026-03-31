import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TicketStatus, UserRole } from '../common/enums';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ReplyTicketDto } from './dto/reply-ticket.dto';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // ─── FAQ (public) ──────────────────────────────────────────────────────────

  @Get('faq')
  getFaqs() {
    return this.supportService.getFaqs();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('faq/all')
  getAllFaqs() {
    return this.supportService.getAllFaqs();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('faq')
  createFaq(
    @Body()
    body: {
      question: string;
      answer: string;
      category?: string;
      position?: number;
    },
  ) {
    return this.supportService.createFaq(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('faq/:id')
  updateFaq(
    @Param('id') id: string,
    @Body()
    body: {
      question?: string;
      answer?: string;
      category?: string;
      position?: number;
      isPublished?: boolean;
    },
  ) {
    return this.supportService.updateFaq(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('faq/:id')
  deleteFaq(@Param('id') id: string) {
    return this.supportService.deleteFaq(id);
  }

  // ─── Tickets ───────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('tickets')
  createTicket(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateTicketDto,
  ) {
    return this.supportService.createTicket(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets/me')
  getMyTickets(@CurrentUser('sub') userId: string) {
    return this.supportService.getMyTickets(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('tickets')
  getAllTickets() {
    return this.supportService.getAllTickets();
  }

  @UseGuards(JwtAuthGuard)
  @Get('tickets/:id')
  getTicket(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.supportService.getTicketById(id, userId, role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('tickets/:id/reply')
  replyToTicket(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
    @Body() dto: ReplyTicketDto,
  ) {
    return this.supportService.reply(id, userId, role, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('tickets/:id/status')
  updateTicketStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.supportService.updateTicketStatus(id, body.status as TicketStatus);
  }
}
