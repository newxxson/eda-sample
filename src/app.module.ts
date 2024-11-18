import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order/entity/order.entity';
import { Product } from './product/entity/product.entity';
import { Delivery } from './delivery/entity/delivery.entity';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { DeliveryModule } from './delivery/delivery.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // This will create a file named 'test.sqlite' in your project root
      entities: [Order, Product, Delivery],
      synchronize: true,
      logging: ['query', 'error'], // Enable query and error logging
    }),
    EventEmitterModule.forRoot(),
    OrderModule,
    ProductModule,
    DeliveryModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
