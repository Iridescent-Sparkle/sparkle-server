import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Experience } from 'apps/genius/src/entities/experience.entity';
import { firstValueFrom } from 'rxjs';

@Controller('genius/experience')
export class ExperienceController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user/:userId')
  async findExperienceByUserId(@Param('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findExperienceByUserId', userId),
    );
  }

  @Post('create')
  async createExperience(@Body() experience: Experience) {
    return firstValueFrom(
      this.GeniusClient.send('createExperience', experience),
    );
  }

  @Put('update')
  async updateExperienceStatus(@Body() experience: Experience) {
    return firstValueFrom(
      this.GeniusClient.send('updateExperienceStatus', experience),
    );
  }

  @Delete('remove')
  async deleteExperience(@Body() experience: Experience) {
    return firstValueFrom(
      this.GeniusClient.send('deleteExperience', experience),
    );
  }
}
