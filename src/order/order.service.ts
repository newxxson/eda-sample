import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderFactory, OrderStatus } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create_order.dto';
import { Product } from 'src/product/entity/product.entity';
import { Delivery, DeliveryFactory } from 'src/delivery/entity/delivery.entity';
import { UpdateOrderDto } from './dto/update_order.dto';
import axios from 'axios';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async create(createOrderDto: CreateOrderDto): Promise<[Order, Delivery]> {
    const productResponse = await axios.get(
      `http://localhost:3001/products/${createOrderDto.product_id}`,
    );
    const product = productResponse.data;

    const order = await this.orderRepository.save(
      OrderFactory.create(product, createOrderDto.quantity),
    );

    const deliveryResponse = await axios.post(
      'http://localhost:3002/delivery',
      {
        address: createOrderDto.address,
        orderIdentifier: order.identifier,
      },
    );
    const delivery: Delivery = deliveryResponse.data;

    return [order, delivery];
  }

  async update(updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { identifier: updateOrderDto.order_id },
    });

    order.status = updateOrderDto.status;

    const updatedOrder = await this.orderRepository.save(order);

    if (updateOrderDto.status === OrderStatus.CANCELED) {
      await axios.put(
        `http://localhost:3002/delivery/order/${order.identifier}/cancel`,
      );
    }

    return updatedOrder;
  }
}
