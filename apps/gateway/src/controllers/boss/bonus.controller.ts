import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobBonus } from 'apps/boss/src/entities/bonus.entity';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/bonus',
})
export class BonusController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  initJobBonus() {
    return this.BossClient.send('initJobBonus', {});
  }

  @Get('all')
  findAllJobBonus(): Promise<JobBonus[]> {
    return firstValueFrom(this.BossClient.send('findAllJobBonus', {}));
  }
}
