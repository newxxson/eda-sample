import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ProductDto } from '../dto/product.dto';

export enum OrderStatus {
  CANCELED = -1,
  APPROVED = 1,
  DELEVERED = 2,
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  identifier: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ name: 'product_identifier' })
  productIdentifier: string;

  @Column()
  created_at: Date;

  @Column({ type: 'integer' })
  status: number;
}

export class OrderFactory {
  static create(product: ProductDto, quantity: number): Order {
    const order = new Order();
    order.productIdentifier = product.identifier;
    order.name = product.name;
    order.price = product.price;
    order.quantity = quantity;
    order.created_at = new Date();
    order.status = OrderStatus.APPROVED;
    return order;
  }
}
