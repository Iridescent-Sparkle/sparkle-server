import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from '../service/order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('createOreder')
  createOreder(params: { totalAmount: number; subject: string }) {
    return this.orderService.createOreder(params);
  }

  @MessagePattern('receiveOrederResult')
  receiveOrederResult(params: any) {
    return this.orderService.receiveOrederResult(params);
  }
}
