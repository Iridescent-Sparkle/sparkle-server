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
import { DeliverService } from 'apps/genius/src/service/deliver.service';
import { GrpcExceptionFilter } from 'filters/rpc-exception.filter';

@Controller('deliveries')
@UseFilters(GrpcExceptionFilter)
export class DeliverController {
  @Inject('genius')
  private client: ClientGrpc;

  private deliverService: DeliverService;

  onModuleInit() {
    this.deliverService = this.client.getService('DeliverService');
  }

  @Get('user/:userId')
  async findDeliverStatusByUserId(@Param('userId') userId: number) {
    return this.deliverService.findDeliverStatusByUserId({ userId });
  }

  @Post('create')
  async createDeliver(
    @Body() deliverData: { jobId: number; userId: number; status: number },
  ) {
    return this.deliverService.createDeliver(deliverData);
  }

  @Put('update')
  async updateDeliverStatus(
    @Body() deliverData: { deliverId: number; status: number },
  ) {
    return this.deliverService.updateDeliverStatus(deliverData);
  }

  @Delete('remove')
  async deleteDeliver(@Body() deliverData: { deliverId: number }) {
    return this.deliverService.deleteDeliver(deliverData);
  }
}
