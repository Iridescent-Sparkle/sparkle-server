import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Experience } from '../entities/experience.entity';
import { ExperienceService } from '../service/experience.service';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @MessagePattern('findExperienceByUserId')
  async findExperienceByUserId(userId: number) {
    return this.experienceService.findExperienceByUserId(userId);
  }

  @MessagePattern('createExperience')
  async createExperience(experience: Experience) {
    return this.experienceService.createExperience(experience);
  }

  @MessagePattern('updateExperienceStatus')
  async updateExperienceStatus(experience: Experience) {
    return this.experienceService.createExperience(experience);
  }

  @MessagePattern('deleteExperience')
  async deleteExperience(experience: Experience) {
    return this.experienceService.deleteExperience(experience.id);
  }
}
