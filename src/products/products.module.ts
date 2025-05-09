import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from '../entities/product/product';


@Module({
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
