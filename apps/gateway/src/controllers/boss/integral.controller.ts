import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IntegralMeal } from 'apps/boss/src/entities/integral.entity';
import { RequireLogin } from 'decorators/custom.decorator';
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

  @Post('update')
  @RequireLogin()
  async updateIntegralMeal(@Body() params: IntegralMeal) {
    return firstValueFrom(this.BossClient.send('updateIntegralMeal', params));
  }
}
