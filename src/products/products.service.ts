import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product/product';

@Injectable()
export class ProductsService {
  private products: Product[] = []; // Simulé

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find(product => product.id === id);
  }

  create(productData: Product) {
    this.products.push(productData);
    return productData;
  }

  remove(id: number) {
    this.products = this.products.filter(product => product.id !== id);
    return { message: 'Produit supprimé' };
  }
}