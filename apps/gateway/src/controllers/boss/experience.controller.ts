import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JobExperience } from 'apps/boss/src/entities/experience.entity';
import { firstValueFrom } from 'rxjs';

@Controller({
  path: 'boss/experience',
})
export class ExperienceController {
  @Inject('BOSS_SERVICE')
  private BossClient: ClientProxy;

  @Get('init')
  initJobExperience() {
    return this.BossClient.send('initJobExperience', {});
  }

  @Get('all')
  findAllJobExperience(): Promise<JobExperience[]> {
    return firstValueFrom(this.BossClient.send('findAllJobExperience', {}));
  }
}
