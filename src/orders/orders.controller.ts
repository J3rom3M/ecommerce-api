import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('cart')
  @UseGuards(JwtAuthGuard)
  addToCart(@Request() req, @Body() body: { productId: number; quantity: number }) {
    return this.ordersService.addToCart(req.user.id, body.productId, body.quantity);
  }

  @Get('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@Request() req) {
    return this.ordersService.checkout(req.user.id);
  }
}