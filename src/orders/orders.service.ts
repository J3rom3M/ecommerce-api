import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order/order';
import { Cart } from '../entities/cart/cart';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    private readonly mailService: MailService // ✅ Injection du service e-mail
  ) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    const order = this.orderRepository.create({ user: { id: userId }, product: { id: productId }, quantity });
    return this.orderRepository.save(order);
  }

  async getCart(userId: number) {
    return this.cartRepository.find({ where: { user: { id: userId } }, relations: ['product'] });
  }  

  async checkout(userId: number) {
      const cartItems = await this.getCart(userId);
      if (cartItems.length === 0) throw new Error("Panier vide !");

      const orders = cartItems.map(item => ({
        user: { id: userId },
        product: item.product,
        quantity: item.quantity,
        totalPrice: item.quantity * item.product.price,
        status: OrderStatus.PAID, // ✅ La commande passe en statut "Payée"
      }));

      await this.orderRepository.save(orders);
      await this.cartRepository.delete({ user: { id: userId } }); // Nettoyage du panier

      // ✉️ Envoi d’un e-mail de confirmation
      const userEmail = "email_utilisateur@example.com"; // Récupère l'e-mail depuis la base
      await this.mailService.sendOrderConfirmation(userEmail, orders);

      return orders;
    }

  // ✅ Ajout du nouvel endpoint pour annuler une commande
  async cancelOrder(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({ where: { id: orderId, user: { id: userId } } });

    if (!order || order.status !== OrderStatus.PENDING) {
      throw new Error("Impossible d'annuler cette commande");
    }

    await this.orderRepository.delete(orderId);
    return { message: "Commande annulée avec succès" };
  }

  async updateStatus(orderId: number, newStatus: OrderStatus) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new Error("Commande introuvable !");
    }

    order.status = newStatus;
    await this.orderRepository.save(order);
    return { message: `Statut mis à jour : ${newStatus}` };
  }

  async getOrderById(orderId: number, userId: number) {
    return this.orderRepository.findOne({ where: { id: orderId, user: { id: userId } } });
  }
}