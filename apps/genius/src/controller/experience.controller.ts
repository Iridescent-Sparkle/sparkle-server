import { Body, Controller, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Experience } from '../entities/experience.entity';
import { ExperienceService } from '../service/experience.service';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @MessagePattern('findExperienceByUserId')
  async findExperienceByUserId(@Param('userId') userId: number) {
    return this.experienceService.findExperienceByUserId(userId);
  }

  @MessagePattern('createExperience')
  async createExperience(@Body() experience: Experience) {
    return this.experienceService.createExperience(experience);
  }

  @MessagePattern('updateExperienceStatus')
  async updateExperienceStatus(@Body() experience: Experience) {
    return this.experienceService.createExperience(experience);
  }

  @MessagePattern('deleteExperience')
  async deleteExperience(@Body() experience: Experience) {
    return this.experienceService.deleteExperience(experience.id);
  }
}
