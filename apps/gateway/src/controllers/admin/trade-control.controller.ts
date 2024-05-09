import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TradeControl } from 'apps/admin/src/entities/trade.entity';
import { RequireLogin } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'admin/trade-control',
})
export class TradeControlController {
  @Inject('ADMIN_SERVICE')
  private adminClient: ClientProxy;

  @Post('all')
  @RequireLogin()
  async findAllTradeControl(@Body() params: Pagination) {
    return firstValueFrom(this.adminClient.send('findAllTradeControl', params));
  }

  @Post('create')
  @RequireLogin()
  async createTradeControl(@Body() params: TradeControl) {
    return firstValueFrom(this.adminClient.send('createTradeControl', params));
  }

  @Post('update')
  @RequireLogin()
  async updateTradeControl(@Body() params: TradeControl) {
    return firstValueFrom(this.adminClient.send('updateTradeControl', params));
  }
}
