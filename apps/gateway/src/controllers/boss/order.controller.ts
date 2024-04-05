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
  createOreder(@Body() params: { totalAmount: number; subject: string }) {
    return firstValueFrom(this.BossClient.send('createOreder', params));
  }

  @Post('receive')
  @RequireLogin()
  receiveOrederResult(@Body() params: any) {
    return firstValueFrom(this.BossClient.send('receiveOrederResult', params));
  }
}
