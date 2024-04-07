import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IntegralRecord } from 'apps/boss/src/entities/consume.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/consume',
})
export class ConsumeController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Post('user')
  @RequireLogin()
  findIntegralRecordByUserId(@UserInfo('userId') userId: number) {
    return firstValueFrom(
      this.BossClient.send('findIntegralRecordByUserId', userId),
    );
  }

  @Post('create')
  @RequireLogin()
  createIntegralRecord(
    @UserInfo('userId') userId: number,
    @Body() params: IntegralRecord,
  ) {
    return firstValueFrom(
      this.BossClient.send('createIntegralRecord', {
        userId,
        ...params,
      }),
    );
  }

  @Post('usage/type')
  @RequireLogin()
  async queryUsageByType() {
    return firstValueFrom(this.BossClient.send('queryUsageByType', {}));
  }

  @Post('usage/days')
  @RequireLogin()
  async queryConsumptionLast7Days() {
    return firstValueFrom(
      this.BossClient.send('queryConsumptionLast7Days', {}),
    );
  }
}
