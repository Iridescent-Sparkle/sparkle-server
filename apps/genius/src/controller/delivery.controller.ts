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
    console.log(deliveryData);
    return this.deliveryService.createDelivery(jobId, userId, status);
  }

  @Put('update/:deliveryId')
  async updateDeliveryStatus(
    @Param('deliveryId') deliveryId: number,
    @Body() deliveryData: any,
  ) {
    const { status } = deliveryData;
    return this.deliveryService.updateDeliveryStatus(deliveryId, status);
  }

  @Delete('remove/:deliveryId')
  async deleteDelivery(@Param('deliveryId') deliveryId: number) {
    return this.deliveryService.deleteDelivery(deliveryId);
  }
}
