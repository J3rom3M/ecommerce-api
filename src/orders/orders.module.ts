import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from '../entities/order/order';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    JwtModule.register({
      secret: 'SECRET_KEY', // 🔹 Change en variable d’environnement en prod
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}