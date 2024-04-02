import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobBonus } from 'apps/boss/src/entities/bonus.entity';
import { RequireLogin } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/bonus',
})
export class BonusController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  @RequireLogin()
  initJobBonus() {
    return this.BossClient.send('initJobBonus', {});
  }

  @Post('all')
  @RequireLogin()
  findAllJobBonus(@Body() parmas: JobBonus & Pagination): Promise<JobBonus[]> {
    return firstValueFrom(this.BossClient.send('findAllJobBonus', parmas));
  }

  @Post('update')
  @RequireLogin()
  updateJobBonus(@Body() parmas: JobBonus): Promise<JobBonus[]> {
    return firstValueFrom(this.BossClient.send('updateJobBonus', parmas));
  }
}
