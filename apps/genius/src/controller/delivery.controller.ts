import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { DeliveryService } from '../service/deliver.service';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @GrpcMethod('DeliveryService', 'FindDeliveryStatusByUserId')
  async findDeliveryStatusByUserId({ userId }: { userId: number }) {
    return this.deliveryService.findDeliveryStatusByUserId({ userId });
  }

  @GrpcMethod('DeliveryService', 'CreateDelivery')
  async createDelivery(deliveryData: {
    jobId: number;
    userId: number;
    status: number;
  }) {
    return this.deliveryService.createDelivery(deliveryData);
  }

  @GrpcMethod('DeliveryService', 'UpdateDeliveryStatus')
  async updateDeliveryStatus(deliveryData: {
    deliverId: number;
    status: number;
  }) {
    return this.deliveryService.updateDeliveryStatus(deliveryData);
  }

  @GrpcMethod('DeliveryService', 'DeleteDelivery')
  async deleteDelivery(deliveryData: { deliverId: number }) {
    return this.deliveryService.deleteDelivery(deliveryData);
  }
}
