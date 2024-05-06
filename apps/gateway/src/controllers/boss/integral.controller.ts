import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IntegralMeal } from 'apps/boss/src/entities/integral.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/integral',
})
export class IntegralController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  @RequireLogin()
  initIntegralMeal() {
    return this.BossClient.send('initIntegralMeal', {});
  }

  @Post('all')
  @RequireLogin()
  findAllIntegralMeal(@Body() params: IntegralMeal & Pagination) {
    return firstValueFrom(this.BossClient.send('findAllIntegralMeal', params));
  }

  @Post('create')
  @RequireLogin()
  createIntegralMeal(@Body() params: IntegralMeal) {
    return firstValueFrom(this.BossClient.send('createIntegralMeal', params));
  }

  @Post('update')
  @RequireLogin()
  async updateIntegralMeal(@Body() params: IntegralMeal) {
    return firstValueFrom(this.BossClient.send('updateIntegralMeal', params));
  }

  @Post('recharge')
  @RequireLogin()
  async rechargeIntegral(
    @UserInfo('userId') userId: number,
    @Body() params: { integral: number },
  ) {
    return firstValueFrom(
      this.BossClient.send('rechargeIntegral', {
        userId,
        integral: params.integral,
      }),
    );
  }

  @Post('consume')
  @RequireLogin()
  async consumeIntegral(
    @UserInfo('userId') userId: number,
    @Body() params: { integral: number },
  ) {
    return firstValueFrom(
      this.BossClient.send('consumeIntegral', {
        userId,
        integral: params.integral,
      }),
    );
  }
}
