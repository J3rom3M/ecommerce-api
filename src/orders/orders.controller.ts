import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { OrderStatus } from '../entities/order/order';
import { StripeService } from '../stripe/stripe.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly stripeService: StripeService // ✅ Injection du service Stripe
  ) {}


  @Post('cart')
  @UseGuards(JwtAuthGuard)
  addToCart(@Request() req, @Body() body: { productId: number; quantity: number }) {
    return this.ordersService.addToCart(req.user.id, body.productId, body.quantity);
  }

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  getCart(@Request() req) {
    return this.ordersService.getCart(req.user.id);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  checkout(@Request() req) {
    return this.ordersService.checkout(req.user.id);
  }

  // ✅ Ajout du nouvel endpoint pour annuler une commande
  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  cancelOrder(@Request() req, @Body() body: { orderId: number }) {
    return this.ordersService.cancelOrder(req.user.id, body.orderId);
  }

  @Post('update-status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Request() req, @Body() body: { orderId: number; newStatus: OrderStatus }) {
    return this.ordersService.updateStatus(body.orderId, body.newStatus);
  }

  @Post('pay')
  @UseGuards(JwtAuthGuard)
  async payOrder(@Request() req, @Body() body: { orderId: number }) {
    const order = await this.ordersService.getOrderById(body.orderId, req.user.id);
    if (!order) throw new Error("Commande introuvable");

    const clientSecret = await this.stripeService.createPaymentIntent(order.totalPrice, 'eur');
    return { message: 'Paiement en cours', clientSecret };
  }
}