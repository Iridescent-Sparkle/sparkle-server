import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TradeControl } from 'apps/admin/src/entities/trade.entity';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'admin/trade-control',
})
export class TradeControlController {
  @Inject('ADMIN_SERVICE')
  private adminClient: ClientProxy;

  @Post('all')
  async findAllTradeControl(@Body() params: Pagination) {
    return firstValueFrom(this.adminClient.send('findAllTradeControl', params));
  }

  @Post('create')
  async createTradeControl(@Body() params: TradeControl) {
    return firstValueFrom(this.adminClient.send('createTradeControl', params));
  }

  @Post('update')
  async updateTradeControl(@Body() params: TradeControl) {
    return firstValueFrom(this.adminClient.send('updateTradeControl', params));
  }
}
