import { InjectRepository } from '@nestjs/typeorm';
import {
  Delivery,
  DeliveryFactory,
  DeliveryStatus,
} from './entity/delivery.entity';
import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateDeliveryDto } from './dto/update_delivery.dto';
import { CreateDeliveryDto } from './dto/create_delivery.dto';
import axios from 'axios';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async findAll(): Promise<Delivery[]> {
    return await this.deliveryRepository.find();
  }

  async update(
    deliveryId: string,
    updateDeliveryDto: UpdateDeliveryDto,
  ): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { identifier: deliveryId },
    });

    if (!delivery) {
      throw new HttpException('Delivery not found', 404);
    }

    delivery.status = updateDeliveryDto.status;

    if (updateDeliveryDto.status === DeliveryStatus.DELIVERED) {
      delivery.delivered_at = new Date();
    }

    await this.deliveryRepository.save(delivery);

    if (updateDeliveryDto.status === DeliveryStatus.DELIVERED) {
      try {
        await axios.post('http://localhost:3000', {
          orderId: delivery.orderIdentifier,
          status: updateDeliveryDto.status,
        });
      } catch (error) {
        console.error('Error making POST request', error);
      }
    }

    return;
  }

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const delivery = DeliveryFactory.create(
      createDeliveryDto.address,
      createDeliveryDto.orderIdentifier,
    );

    return await this.deliveryRepository.save(delivery);
  }

  async cancel(orderId: string): Promise<void> {
    const delivery = await this.deliveryRepository.findOne({
      where: { orderIdentifier: orderId },
    });

    if (!delivery) {
      throw new HttpException('Delivery not found', 404);
    }

    delivery.status = DeliveryStatus.CANCELED;

    await this.deliveryRepository.save(delivery);
  }
}
