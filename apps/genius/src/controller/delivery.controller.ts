import { Body, Controller, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { DeliveryService } from '../service/deliver.service';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @GrpcMethod('DeliveryService', 'FindDeliveryStatusByUserId')
  async findDeliveryStatusByUserId(@Param('userId') userId: number) {
    return this.deliveryService.findDeliveryStatusByUserId(userId);
  }

  @GrpcMethod('DeliveryService', 'CreateDelivery')
  async createDelivery(@Body() deliveryData: any) {
    const { jobId, userId, status } = deliveryData;
    return this.deliveryService.createDelivery(jobId, userId, status);
  }

  @GrpcMethod('DeliveryService', 'UpdateDeliveryStatus')
  async updateDeliveryStatus(@Body() deliveryData: any) {
    const { jobId, userId, status } = deliveryData;
    return this.deliveryService.updateDeliveryStatus(jobId, userId, status);
  }

  @GrpcMethod('DeliveryService', 'DeleteDelivery')
  async deleteDelivery(@Body() deliveryData: any) {
    const { jobId, userId } = deliveryData;
    return this.deliveryService.deleteDelivery(jobId, userId);
  }
}
