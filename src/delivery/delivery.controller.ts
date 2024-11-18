import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { UpdateDeliveryDto } from './dto/update_delivery.dto';
import { CreateDeliveryDto } from './dto/create_delivery.dto';

@Controller('deliveries')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get('')
  async getAllDeliveries() {
    return await this.deliveryService.findAll();
  }

  @Put('/order/:orderId/cancel')
  @HttpCode(200)
  async cancelDelivery(@Param('orderId') orderId: string) {
    await this.deliveryService.cancel(orderId);
  }

  @Put('/:deliveryId')
  @HttpCode(200)
  async updateDelivery(
    @Param('deliveryId') deliveryId: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return await this.deliveryService.update(deliveryId, updateDeliveryDto);
  }

  @Post('')
  @HttpCode(201)
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    return await this.deliveryService.create(createDeliveryDto);
  }
}
