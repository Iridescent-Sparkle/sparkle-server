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
import { ClientProxy } from '@nestjs/microservices';
import { GrpcExceptionFilter } from 'filters/rpc-exception.filter';
import { firstValueFrom } from 'rxjs';

@Controller('genius/deliveries')
@UseFilters(GrpcExceptionFilter)
export class DeliverController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user/:userId')
  async findDeliverStatusByUserId(@Param('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findDeliverStatusByUserId', { userId }),
    );
  }

  @Post('create')
  async createDeliver(
    @Body() deliverData: { jobId: number; userId: number; status: number },
  ) {
    return firstValueFrom(this.GeniusClient.send('createDeliver', deliverData));
  }

  @Put('update')
  async updateDeliverStatus(
    @Body() deliverData: { deliverId: number; status: number },
  ) {
    return firstValueFrom(
      this.GeniusClient.send('updateDeliverStatus', deliverData),
    );
  }

  @Delete('remove')
  async deleteDeliver(@Body() deliverData: { deliverId: number }) {
    return firstValueFrom(this.GeniusClient.send('deleteDeliver', deliverData));
  }
}
