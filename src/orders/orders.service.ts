import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order/order';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    const order = this.orderRepository.create({ user: { id: userId }, product: { id: productId }, quantity });
    return this.orderRepository.save(order);
  }

  async checkout(userId: number) {
    return this.orderRepository.find({ where: { user: { id: userId } } });
  }
}