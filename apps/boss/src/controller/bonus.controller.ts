import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BonusService } from 'apps/boss/src/service/bonus.service';
import { JobBonus } from '../entities/bonus.entity';

@Controller()
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  @MessagePattern('initJobBonus')
  initJobBonus() {
    return this.bonusService.initJobBonus();
  }

  @MessagePattern('findAllJobBonus')
  findAllJobBonus(parmas: JobBonus & Pagination) {
    return this.bonusService.findAllJobBonus(parmas);
  }

  @MessagePattern('updateJobBonus')
  async updateJobBonus(params: JobBonus) {
    await this.bonusService.updateJobBonus(params);
  }
}
