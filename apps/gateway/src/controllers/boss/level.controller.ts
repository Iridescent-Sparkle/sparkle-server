import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobLevel } from 'apps/boss/src/entities/level.entity';
import { RequireLogin } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/level',
})
export class LevelController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  @RequireLogin()
  initJobLevel() {
    return this.BossClient.send('initJobLevel', {});
  }

  @Post('all')
  @RequireLogin()
  findAllJobLevel(): Promise<JobLevel[]> {
    return firstValueFrom(this.BossClient.send('findAllJobLevel', {}));
  }
}
