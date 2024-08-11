import { InjectRepository } from '@nestjs/typeorm';
import { Delivery, DeliveryStatus } from './entity/delivery.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateDeliveryDto } from './dto/update_delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async findAll(): Promise<Delivery[]> {
    return await this.deliveryRepository.find();
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
}
