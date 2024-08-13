import { InjectRepository } from '@nestjs/typeorm';
import {
  Delivery,
  DeliveryFactory,
  DeliveryStatus,
} from './entity/delivery.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateDeliveryDto } from './dto/update_delivery.dto';
import {
  OrderCreatedEvent,
  OrderEventDto,
  OrderUpdatedEvent,
} from 'src/order/dto/order_event.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async findAll(): Promise<Delivery[]> {
    const deliveries = await this.deliveryRepository.find();
    console.log(deliveries.map((delivery) => delivery.order));
    return deliveries;
  }

  async update(updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { identifier: updateDeliveryDto.delivery_id },
    });

    delivery.status = updateDeliveryDto.status;

    if (updateDeliveryDto.status === DeliveryStatus.DELIVERED) {
      delivery.delivered_at = new Date();
    }

    return await this.deliveryRepository.save(delivery);
  }

  async createDelivery(orderEventDto: OrderCreatedEvent): Promise<void> {
    const delivery = DeliveryFactory.create(
      orderEventDto.address,
      orderEventDto.orderId,
    );

    await this.deliveryRepository.save(delivery);

    console.log('Delivery created', delivery);
  }

  async cancelDelivery(orderEventDto: OrderUpdatedEvent): Promise<void> {
    console.log('Canceling delivery', orderEventDto);

    const delivery = await this.deliveryRepository.findOne({
      where: { orderIdentifier: orderEventDto.orderId },
    });

    delivery.status = DeliveryStatus.CANCELED;

    await this.deliveryRepository.save(delivery);

    console.log('Delivery canceled', delivery);
  }
}
