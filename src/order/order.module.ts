import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Product } from 'src/product/entity/product.entity';
import { Delivery } from 'src/delivery/entity/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Delivery])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
