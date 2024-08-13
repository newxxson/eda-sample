import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderFactory, OrderStatus } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create_order.dto';
import { UpdateOrderDto } from './dto/update_order.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderCreatedEvent, OrderUpdatedEvent } from './dto/order_event.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepository.save(
      OrderFactory.create(createOrderDto),
    );

    await this.eventEmitter.emitAsync(
      'order.created',
      new OrderCreatedEvent(order, createOrderDto.address),
    );
    console.log('Order created', order);
    return order;
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { identifier: orderId },
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    order.status = updateOrderDto.status;

    const updatedOrder = await this.orderRepository.save(order);

    if (updatedOrder.status == OrderStatus.CANCELED) {
      this.eventEmitter.emit(
        'order.canceled',
        new OrderUpdatedEvent(updatedOrder),
      );
    }
    console.log('Order updated', updatedOrder);
    return updatedOrder;
  }
}
