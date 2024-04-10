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
  findAllJobBonus(@Body() params: JobBonus & Pagination) {
    return firstValueFrom(this.BossClient.send('findAllJobBonus', params));
  }

  @Post('create')
  @RequireLogin()
  createJobBonus(@Body() params: JobBonus) {
    return firstValueFrom(this.BossClient.send('createJobBonus', params));
  }

  @Post('update')
  @RequireLogin()
  updateJobBonus(@Body() params: JobBonus) {
    return firstValueFrom(this.BossClient.send('updateJobBonus', params));
  }

  @Post('delete')
  @RequireLogin()
  deleteJobBonus(@Body() params: JobBonus) {
    return firstValueFrom(this.BossClient.send('deleteJobBonus', params));
  }
}
