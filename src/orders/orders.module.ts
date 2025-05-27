import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../entities/order/order';
import { Cart } from '../entities/cart/cart';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Cart]), // Ajout des entités
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 🔹 Utilisation de variable d’environnement
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [OrdersService, MailService], // ✅ Ajout de MailService ici
  controllers: [OrdersController],
  exports: [OrdersService],
})

@Module({
  providers: [OrdersService, MailService], // ✅ Ajout du service e-mail
})

export class OrdersModule {}