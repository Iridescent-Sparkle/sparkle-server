import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequireLogin } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/order',
})
export class OrderController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Post('create')
  @RequireLogin()
  createOrder(
    @Body()
    params: {
      totalAmount: number;
      subject: string;
      body: string;
      passback_params: Record<string, any>;
    },
  ) {
    return firstValueFrom(this.BossClient.send('createOrder', params));
  }

  @Post('receive')
  receiveOrederResult(@Body() params: any) {
    return firstValueFrom(this.BossClient.send('receiveOrederResult', params));
  }

  @Post('all')
  @RequireLogin()
  findAllOrderList(@Body() params: any) {
    return firstValueFrom(this.BossClient.send('findAllOrderList', params));
  }

  @Post('refund')
  @RequireLogin()
  refundOrder(
    @Body()
    params: {
      refund_amount: number;
      trade_no: number;
      refund_reason: string;
    },
  ) {
    return firstValueFrom(this.BossClient.send('refundOrder', params));
  }
}
