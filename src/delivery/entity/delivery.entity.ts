import { Order } from 'src/order/entity/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export enum DeliveryStatus {
  CANCELED = 'CANCELED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
}

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  identifier: string;

  @Column()
  address: string;

  @Column()
  created_at: Date;

  @Column()
  modified_at: Date;

  @Column({ nullable: true })
  delivered_at: Date | null;

  @Column()
  status: string;

  @Column({ name: 'order_identifier' })
  orderIdentifier: string;

  // Keep the relationship with the Order entity
  @OneToOne(() => Order, { nullable: false, eager: true })
  @JoinColumn({ name: 'order_identifier' })
  order: Order;
}

export class DeliveryFactory {
  static create(address: string, orderIdentifier: string): Delivery {
    const delivery = new Delivery();
    delivery.address = address;
    delivery.orderIdentifier = orderIdentifier;
    delivery.created_at = new Date();
    delivery.modified_at = new Date();
    delivery.status = DeliveryStatus.DELIVERING;
    return delivery;
  }
}
