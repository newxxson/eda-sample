import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { UpdateDeliveryDto } from './dto/update_delivery.dto';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OrderCreatedEvent,
  OrderEventDto,
  OrderUpdatedEvent,
} from 'src/order/dto/order_event.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get('')
  async getAllDeliveries() {
    return await this.deliveryService.findAll();
  }

  @Put('')
  @HttpCode(200)
  async updateDelivery(@Body() updateDeliveryDto: UpdateDeliveryDto) {
    return await this.deliveryService.update(updateDeliveryDto);
  }

  @OnEvent('order.created')
  async handleOrderCreatedEvent(event: OrderCreatedEvent): Promise<void> {
    await this.deliveryService.createDelivery(event);
  }

  @OnEvent('order.canceled')
  async handleOrderCanceledEvent(event: OrderUpdatedEvent): Promise<void> {
    await this.deliveryService.cancelDelivery(event);
  }
}
