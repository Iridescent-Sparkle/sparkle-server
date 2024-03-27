import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { DeliverService } from '../service/deliver.service';

@Controller('deliveries')
export class DeliverController {
  constructor(private readonly deliverService: DeliverService) {}

  @GrpcMethod('DeliverService', 'FindDeliverStatusByUserId')
  async findDeliverStatusByUserId({ userId }: { userId: number }) {
    return this.deliverService.findDeliverStatusByUserId({ userId });
  }

  @GrpcMethod('DeliverService', 'CreateDeliver')
  async createDeliver(deliverData: {
    jobId: number;
    userId: number;
    status: number;
  }) {
    return this.deliverService.createDeliver(deliverData);
  }

  @GrpcMethod('DeliverService', 'UpdateDeliverStatus')
  async updateDeliverStatus(deliverData: {
    deliverId: number;
    status: number;
  }) {
    return this.deliverService.updateDeliverStatus(deliverData);
  }

  @GrpcMethod('DeliverService', 'DeleteDeliver')
  async deleteDeliver(deliverData: { deliverId: number }) {
    return this.deliverService.deleteDeliver(deliverData);
  }
}
