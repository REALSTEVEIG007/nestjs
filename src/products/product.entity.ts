import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: true })
  isAvailable: boolean;
}
