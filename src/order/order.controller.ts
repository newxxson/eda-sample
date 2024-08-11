import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create_order.dto';
import { UpdateOrderDto } from './dto/update_order.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('')
  @HttpCode(201)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(createOrderDto);
  }

  @Get('')
  @HttpCode(200)
  async getAllOrders() {
    return await this.orderService.findAll();
  }

  @Put('')
  @HttpCode(200)
  async updateOrder(@Body() updateOrderDto: UpdateOrderDto) {
    return await this.orderService.update(updateOrderDto);
  }
}
