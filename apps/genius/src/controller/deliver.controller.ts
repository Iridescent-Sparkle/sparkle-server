import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DeliverService } from '../service/deliver.service';

@Controller('deliveries')
export class DeliverController {
  constructor(private readonly deliverService: DeliverService) {}

  @MessagePattern('findDeliverStatusByUserId')
  async findDeliverStatusByUserId({ userId }: { userId: number }) {
    return this.deliverService.findDeliverStatusByUserId({ userId });
  }

  @MessagePattern('findDeliverStatusByJobId')
  async findDeliverStatusByJobId(deliverData: { deliverId: number }) {
    return this.deliverService.findDeliverStatusByJobId(deliverData);
  }

  @MessagePattern('createDeliver')
  async createDeliver(deliverData: { jobId: number; userId: number }) {
    return this.deliverService.createDeliver(deliverData);
  }

  @MessagePattern('updateDeliverStatus')
  async updateDeliverStatus(deliverData: {
    deliverId: number;
    status: number;
  }) {
    return this.deliverService.updateDeliverStatus(deliverData);
  }

  @MessagePattern('deleteDeliver')
  async deleteDeliver(deliverData: { deliverId: number }) {
    return this.deliverService.deleteDeliver(deliverData);
  }
}
