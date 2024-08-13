import { Order } from '../entity/order.entity';

export class OrderEventDto {
  constructor(order: Order) {
    this.orderId = order.identifier;
    this.productId = order.product;
    this.name = order.name;
    this.price = order.price;
    this.quantity = order.quantity;
    this.status = order.status;
  }

  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  status: number;
}

export class OrderCreatedEvent extends OrderEventDto {
  constructor(order: Order, address: string) {
    super(order);
    this.address = address;
  }
  address: string;
}
export class OrderUpdatedEvent extends OrderEventDto {
  constructor(order: Order) {
    super(order);
  }
}
