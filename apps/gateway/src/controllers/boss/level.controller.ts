import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobLevel } from 'apps/boss/src/entities/level.entity';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/level',
})
export class LevelController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  initJobLevel() {
    return this.BossClient.send('initJobLevel', {});
  }

  @Get('all')
  findAllJobLevel(): Promise<JobLevel[]> {
    return firstValueFrom(this.BossClient.send('findAllJobLevel', {}));
  }
}
