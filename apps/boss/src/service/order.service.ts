import { AlipayService } from '@app/alipay';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderInfo } from '../entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  @InjectRepository(OrderInfo)
  private readonly orderRepository: Repository<OrderInfo>;

  @Inject(AlipayService)
  private readonly alipayService: AlipayService;

  async createOreder(params: { totalAmount: number; subject: string }) {
    return this.alipayService.createOrder(params);
  }
  async receiveOrederResult(params: any) {
    console.log(params);

    return this.orderRepository.save(params);
  }
}
