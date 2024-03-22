import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExperienceService } from '../service/experience.service';
import { Experience } from '../entities/experience.entity';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get('user/:userId')
  async findExperienceByUserId(@Param('userId') userId: number) {
    return this.experienceService.findExperienceByUserId(userId);
  }

  @Post('create')
  async createExperience(@Body() experience: Experience) {
    return this.experienceService.createExperience(experience);
  }

  @Put('update')
  async updateExperienceStatus(@Body() experience: Experience) {
    return this.experienceService.createExperience(experience);
  }

  @Delete('remove')
  async deleteExperience(@Body() experience: Experience) {
    return this.experienceService.deleteExperience(experience.id);
  }
}
