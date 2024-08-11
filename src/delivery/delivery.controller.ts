import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { UpdateDeliveryDto } from './dto/update_delivery.dto';

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
}
