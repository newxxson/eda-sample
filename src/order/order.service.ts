import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderFactory } from './entity/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create_order.dto';
import { Product } from 'src/product/entity/product.entity';
import { Delivery, DeliveryFactory } from 'src/delivery/entity/delivery.entity';
import { UpdateOrderDto } from './dto/update_order.dto';

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
    const product = await this.productRepository.findOne({
      where: { identifier: createOrderDto.product_id },
    });

    const order = await this.orderRepository.save(
      OrderFactory.create(product, createOrderDto.quantity),
    );

    const delivery = await this.deliveryRepository.save(
      DeliveryFactory.create(createOrderDto.address, order.identifier),
    );

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

    return await this.orderRepository.save(order);
  }
}
