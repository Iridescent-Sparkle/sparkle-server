import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Profile } from 'apps/genius/src/entities/profile.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('profile')
export class ProfileController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findProfile(@UserInfo('userId') userId: number) {
    return firstValueFrom(this.GeniusClient.send('findProfile', userId));
  }

  @Post('create')
  @RequireLogin()
  async createProfile(@Body() profile: Profile) {
    return firstValueFrom(this.GeniusClient.send('createProfile', profile));
  }

  @Post('update')
  @RequireLogin()
  async updateProfile(@Body() profile: Profile) {
    return firstValueFrom(this.GeniusClient.send('updateProfile', profile));
  }

  @Post('remove')
  @RequireLogin()
  async deleteProfile(@Body() profile: Profile) {
    return firstValueFrom(this.GeniusClient.send('deleteProfile', profile));
  }
}
