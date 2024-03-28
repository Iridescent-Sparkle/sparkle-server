import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobBonus } from 'apps/boss/src/entities/bonus.entity';
import { BonusService } from 'apps/boss/src/service/bonus.service';

@Controller()
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  @MessagePattern('initJobBonus')
  initJobBonus() {
    return this.bonusService.initJobBonus();
  }

  @MessagePattern('findAllJobBonus')
  findAllJobBonus(): Promise<JobBonus[]> {
    return this.bonusService.findAllJobBonus();
  }
}
