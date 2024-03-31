import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Experience } from 'apps/genius/src/entities/experience.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('genius/experience')
export class ExperienceController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findExperienceByUserId(@UserInfo('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findExperienceByUserId', userId),
    );
  }

  @Get('single')
  @RequireLogin()
  async findExperienceById(@Query() id: number) {
    return firstValueFrom(this.GeniusClient.send('findExperienceById', id));
  }

  @Post('create')
  @RequireLogin()
  async createExperience(
    @UserInfo('userId') userId: number,
    @Body() experience: Experience,
  ) {
    return firstValueFrom(
      this.GeniusClient.send('createExperience', {
        userId,
        ...experience,
      }),
    );
  }

  @Post('update')
  @RequireLogin()
  async updateExperienceStatus(@Body() experience: Experience) {
    return firstValueFrom(
      this.GeniusClient.send('updateExperienceStatus', experience),
    );
  }

  @Post('remove')
  @RequireLogin()
  async deleteExperience(@Body() experience: Experience) {
    return firstValueFrom(
      this.GeniusClient.send('deleteExperience', experience),
    );
  }
}
