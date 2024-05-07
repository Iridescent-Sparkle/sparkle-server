import { AlipayService } from '@app/alipay';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderInfo } from '../entities/order.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  @InjectRepository(OrderInfo)
  private readonly orderRepository: Repository<OrderInfo>;

  @Inject(AlipayService)
  private readonly alipayService: AlipayService;

  async createOrder(params: {
    totalAmount: number;
    subject: string;
    body: string;
    passback_params: Record<string, any>;
  }) {
    return this.alipayService.createOrder(params);
  }

  async receiveOrederResult(params: any) {
    const foundOrder = await this.orderRepository.findOne({
      where: {
        trade_no: params.trade_no,
      },
    });

    if (foundOrder) {
      this.orderRepository.delete(foundOrder.id);
    }

    return this.orderRepository.save(params);
  }

  async findAllOrderList(params: OrderInfo & Pagination) {
    const { current = 1, pageSize = 10, ...rest } = params;

    const condition: Record<string, any> = rest;

    if (rest.subject) {
      condition.subject = Like(`%${rest.subject}%`);
    }

    if (rest.body) {
      condition.body = Like(`%${rest.body}%`);
    }

    const [data, total] = await this.orderRepository.findAndCount({
      where: condition,
      skip: (current - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      current,
      pageSize,
    };
  }

  async refundOrder(params: {
    refund_amount: number;
    trade_no: number;
    refund_reason: string;
  }) {
    return this.alipayService.refundOrder(params);
  }
}
