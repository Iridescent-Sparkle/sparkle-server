import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeliverService } from '../service/deliver.service';

@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliverService) {}

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
