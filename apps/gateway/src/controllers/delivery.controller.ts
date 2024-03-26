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
    return this.deliveryService.findDeliveryStatusByUserId({ userId });
  }

  @Post('create')
  async createDelivery(
    @Body() deliveryData: { jobId: number; userId: number; status: number },
  ) {
    return this.deliveryService.createDelivery(deliveryData);
  }

  @Put('update')
  async updateDeliveryStatus(
    @Body() deliveryData: { deliverId: number; status: number },
  ) {
    return this.deliveryService.updateDeliveryStatus(deliveryData);
  }

  @Delete('remove')
  async deleteDelivery(@Body() deliveryData: { deliverId: number }) {
    return this.deliveryService.deleteDelivery(deliveryData);
  }
}
