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
import { Profile } from 'apps/genius/src/entities/profile.entity';
import { firstValueFrom } from 'rxjs';

@Controller('profile')
export class ProfileController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user/:userId')
  async findProfile(@Param('userId') userId: number) {
    return firstValueFrom(this.GeniusClient.send('findProfile', userId));
  }

  @Post('create')
  async createProfile(@Body() profile: Profile) {
    return firstValueFrom(this.GeniusClient.send('createProfile', profile));
  }

  @Put('update')
  async updateProfile(@Body() profile: Profile) {
    return firstValueFrom(this.GeniusClient.send('updateProfile', profile));
  }

  @Delete('remove')
  async deleteProfile(@Body() profile: Profile) {
    return firstValueFrom(this.GeniusClient.send('deleteProfile', profile));
  }
}
