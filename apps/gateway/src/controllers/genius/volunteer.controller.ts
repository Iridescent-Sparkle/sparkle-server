import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Volunteer } from 'apps/genius/src/entities/volunteer.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('genius/volunteer')
export class VolunteerController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findVolunteerByUserId(@UserInfo('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findVolunteerByUserId', userId),
    );
  }

  @Get('single')
  @RequireLogin()
  async findVolunteerById(@Query() id: number) {
    return firstValueFrom(this.GeniusClient.send('findVolunteerById', id));
  }

  @Post('create')
  @RequireLogin()
  async createVolunteer(
    @UserInfo('userId') userId: number,
    @Body() volunteer: Volunteer,
  ) {
    return firstValueFrom(
      this.GeniusClient.send('createVolunteer', {
        userId,
        ...volunteer,
      }),
    );
  }

  @Post('update')
  @RequireLogin()
  async updateVolunteer(@Body() volunteer: Volunteer) {
    return firstValueFrom(this.GeniusClient.send('updateVolunteer', volunteer));
  }

  @Post('remove')
  @RequireLogin()
  async deleteVolunteer(@Body() volunteer: Volunteer) {
    return firstValueFrom(this.GeniusClient.send('deleteVolunteer', volunteer));
  }
}
