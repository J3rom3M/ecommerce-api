import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user';
import { Product } from '../product/product';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @ManyToOne(() => Product, product => product.id)
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal')
  totalPrice: number;

  @Column({ type: 'varchar', length: 50, default: 'En cours' }) // ✅ Définit un statut par défaut
  status: string;  
}