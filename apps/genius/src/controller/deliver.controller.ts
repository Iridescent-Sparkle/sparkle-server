import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeliverService } from '../service/deliver.service';

@Controller('deliveries')
export class DeliverController {
  constructor(private readonly deliverService: DeliverService) {}

  @MessagePattern('FindDeliverStatusByUserId')
  async findDeliverStatusByUserId({ userId }: { userId: number }) {
    return this.deliverService.findDeliverStatusByUserId({ userId });
  }

  @MessagePattern('CreateDeliver')
  async createDeliver(deliverData: {
    jobId: number;
    userId: number;
    status: number;
  }) {
    return this.deliverService.createDeliver(deliverData);
  }

  @MessagePattern('UpdateDeliverStatus')
  async updateDeliverStatus(deliverData: {
    deliverId: number;
    status: number;
  }) {
    return this.deliverService.updateDeliverStatus(deliverData);
  }

  @MessagePattern('DeleteDeliver')
  async deleteDeliver(deliverData: { deliverId: number }) {
    return this.deliverService.deleteDeliver(deliverData);
  }
}
