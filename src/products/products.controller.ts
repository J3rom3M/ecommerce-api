import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products') // 🔹 Base de l'URL : /products
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get() // 🔹 Route GET /products
  getAllProducts() {
    return this.productService.findAll();
  }

  @Get(':id') // 🔹 Route GET /products/:id
  getProduct(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Post() // 🔹 Route POST /products
  createProduct(@Body() productData) {
    return this.productService.create(productData);
  }

  @Delete(':id') // 🔹 Route DELETE /products/:id
  deleteProduct(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}