import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { IsString, IsDecimal, IsInt, Min, MaxLength } from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  @Index()
  @IsString()
  @MaxLength(255)
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal()
  @Min(0)
  price: number;

  @Column({ type: 'text' })
  @IsString()
  description: string;

  @Column({ nullable: false })
  @IsInt()
  @Min(0)
  stock: number;
}