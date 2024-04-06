import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Profile } from 'apps/genius/src/entities/profile.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('genius/profile')
export class ProfileController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findProfileByUser(@UserInfo('userId') userId: number) {
    return firstValueFrom(this.GeniusClient.send('findProfileByUser', userId));
  }

  @Post('all')
  @RequireLogin()
  async findAllProfile(@Body() params: Profile & Pagination) {
    return firstValueFrom(this.GeniusClient.send('findAllProfile', params));
  }

  @Post('update')
  @RequireLogin()
  async updateProfile(
    @UserInfo('userId') userId: number,
    @Body() profile: Profile & { nickname: string; avatar: string },
  ) {
    return firstValueFrom(
      this.GeniusClient.send('updateProfile', {
        userId,
        profile,
      }),
    );
  }
}
