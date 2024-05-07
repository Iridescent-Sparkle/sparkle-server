import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrderService } from '../service/order.service';
import { OrderInfo } from '../entities/order.entity';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern('createOrder')
  createOrder(params: {
    totalAmount: number;
    subject: string;
    body: string;
    passback_params: Record<string, any>;
  }) {
    return this.orderService.createOrder(params);
  }

  @MessagePattern('receiveOrederResult')
  receiveOrederResult(params: any) {
    return this.orderService.receiveOrederResult(params);
  }

  @MessagePattern('findAllOrderList')
  findAllOrderList(params: OrderInfo & Pagination) {
    return this.orderService.findAllOrderList(params);
  }

  @MessagePattern('refundOrder')
  refundOrder(params: {
    refund_amount: number;
    trade_no: number;
    refund_reason: string;
  }) {
    return this.orderService.refundOrder(params);
  }
}
