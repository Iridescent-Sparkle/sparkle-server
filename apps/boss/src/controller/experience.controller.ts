import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobExperience } from 'apps/boss/src/entities/experience.entity';
import { ExperienceService } from 'apps/boss/src/service/experience.service';

@Controller()
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @MessagePattern('initJobExperience')
  initJobExperience() {
    return this.experienceService.initJobExperience();
  }

  @MessagePattern('findAllJobExperience')
  findAllJobExperience(): Promise<JobExperience[]> {
    return this.experienceService.findAllJobExperience();
  }
}
