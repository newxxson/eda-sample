import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderFactory, OrderStatus } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create_order.dto';
import { UpdateOrderDto } from './dto/update_order.dto';
import axios from 'axios';
import { DeliveryDto } from './dto/delivery.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async create(createOrderDto: CreateOrderDto): Promise<[Order, DeliveryDto]> {
    const productResponse = await axios.get(
      `http://localhost:3001/products/${createOrderDto.productId}`,
    );
    const product = productResponse.data;

    const order = await this.orderRepository.save(
      OrderFactory.create(product, createOrderDto.quantity),
    );

    const deliveryResponse = await axios.post(
      'http://localhost:3002/deliveries',
      {
        address: createOrderDto.address,
        orderIdentifier: order.identifier,
      },
    );
    const delivery = deliveryResponse.data;

    return [order, delivery];
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { identifier: orderId },
    });

    order.status = updateOrderDto.status;

    const updatedOrder = await this.orderRepository.save(order);

    if (updateOrderDto.status === OrderStatus.CANCELED) {
      await axios.put(
        `http://localhost:3002/deliveries/order/${order.identifier}/cancel`,
      );
    }

    return updatedOrder;
  }

  async markAsDelivered(orderId: string): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { identifier: orderId },
    });

    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    order.status = OrderStatus.DELEVERED;

    await this.orderRepository.save(order);
  }
}
