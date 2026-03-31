import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(
    @CurrentUser('sub') userId: string,
    @Body() body: { couponCode?: string },
  ) {
    return this.ordersService.checkout(userId, body.couponCode);
  }

  @Get()
  getOrders(@CurrentUser('sub') userId: string) {
    return this.ordersService.getOrders(userId);
  }

  @Get(':id')
  getOrder(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.getOrderById(userId, id);
  }

  @Post(':id/refund')
  requestRefund(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    return this.ordersService.requestRefund(userId, id);
  }
}
