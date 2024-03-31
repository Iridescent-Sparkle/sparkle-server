import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobEducation } from 'apps/boss/src/entities/education.entity';
import { RequireLogin } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/education',
})
export class EducationController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  @RequireLogin()
  initJobEducation() {
    return this.BossClient.send('initJobEducation', {});
  }

  @Get('all')
  @RequireLogin()
  findAllJobEducation(): Promise<JobEducation[]> {
    return firstValueFrom(this.BossClient.send('findAllJobEducation', {}));
  }
}
