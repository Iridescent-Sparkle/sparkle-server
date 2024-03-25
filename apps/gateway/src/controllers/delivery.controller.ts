import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { DeliveryService } from 'apps/genius/src/service/deliver.service';
import { GrpcExceptionFilter } from 'filters/rpc-exception.filter';

@Controller('deliveries')
@UseFilters(GrpcExceptionFilter)
export class DeliveryController {
  @Inject('category')
  private client: ClientGrpc;

  private deliveryService: DeliveryService;

  onModuleInit() {
    this.deliveryService = this.client.getService('DeliveryService');
  }

  @Get('user/:userId')
  async findDeliveryStatusByUserId(@Param('userId') userId: number) {
    return this.deliveryService.findDeliveryStatusByUserId(userId);
  }

  @Post('create')
  async createDelivery(@Body() deliveryData: any) {
    const { jobId, userId, status } = deliveryData;
    return this.deliveryService.createDelivery(jobId, userId, status);
  }

  @Put('update')
  async updateDeliveryStatus(@Body() deliveryData: any) {
    const { jobId, userId, status } = deliveryData;
    return this.deliveryService.updateDeliveryStatus(jobId, userId, status);
  }

  @Delete('remove')
  async deleteDelivery(@Body() deliveryData: any) {
    const { jobId, userId } = deliveryData;
    return this.deliveryService.deleteDelivery(jobId, userId);
  }
}
