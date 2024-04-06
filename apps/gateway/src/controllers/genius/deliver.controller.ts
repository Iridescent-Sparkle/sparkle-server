import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('genius/deliveries')
export class DeliverController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findDeliverStatusByUserId(@UserInfo('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findDeliverStatusByUserId', { userId }),
    );
  }

  @Post('query')
  @RequireLogin()
  async findDeliverStatusByJobId(@Body() deliverData: { deliverId: number }) {
    return firstValueFrom(
      this.GeniusClient.send('findDeliverStatusByJobId', deliverData),
    );
  }

  @Post('create')
  @RequireLogin()
  async createDeliver(
    @UserInfo('userId') userId: number,
    @Body() deliverData: { jobId: number },
  ) {
    return firstValueFrom(
      this.GeniusClient.send('createDeliver', {
        ...deliverData,
        userId,
      }),
    );
  }

  @Post('update')
  @RequireLogin()
  async updateDeliverStatus(
    @Body() deliverData: { deliverId: number; status: number },
  ) {
    return firstValueFrom(
      this.GeniusClient.send('updateDeliverStatus', deliverData),
    );
  }

  @Post('remove')
  async deleteDeliver(@Body() deliverData: { deliverId: number }) {
    return firstValueFrom(this.GeniusClient.send('deleteDeliver', deliverData));
  }
}
