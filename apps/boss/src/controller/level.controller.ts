import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobLevel } from 'apps/boss/src/entities/level.entity';
import { LevelService } from 'apps/boss/src/service/level.service';

@Controller()
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @MessagePattern('initJobLevel')
  initJobLevel() {
    return this.levelService.initJobLevel();
  }

  @MessagePattern('findAllJobLevel')
  findAllJobLevel(): Promise<JobLevel[]> {
    return this.levelService.findAllJobLevel();
  }
}
