import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PaymentService {
  constructor(private eventEmitter: EventEmitter2) {}

  createPayment(orderIdentifier: string) {
    console.log('payment-created');
    this.eventEmitter.emit('payment.payment-created', {
      orderIdentifier: orderIdentifier,
    });
  }
}
