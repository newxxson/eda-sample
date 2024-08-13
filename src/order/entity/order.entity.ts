import { Product } from 'src/product/entity/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { CreateOrderDto } from '../dto/create_order.dto';

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

  @ManyToOne(() => Product, { nullable: false, eager: true })
  @JoinColumn({ name: 'product_identifier' })
  product: string;

  @Column()
  created_at: Date;

  @Column({ type: 'integer' })
  status: number;
}

export class OrderFactory {
  static create(createOrderDto: CreateOrderDto): Order {
    const order = new Order();
    order.product = createOrderDto.productId;
    order.name = createOrderDto.name;
    order.price = createOrderDto.price * createOrderDto.quantity;
    order.quantity = createOrderDto.quantity;
    order.created_at = new Date();
    order.status = OrderStatus.APPROVED;
    return order;
  }
}
