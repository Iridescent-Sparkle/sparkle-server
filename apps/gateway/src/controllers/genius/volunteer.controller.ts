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
import { Volunteer } from 'apps/genius/src/entities/volunteer.entity';
import { firstValueFrom } from 'rxjs';

@Controller('volunteer')
export class VolunteerController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user/:userId')
  async findVolunteer(@Param('userId') userId: number) {
    return firstValueFrom(this.GeniusClient.send('findVolunteer', userId));
  }

  @Post('create')
  async createVolunteer(@Body() volunteer: Volunteer) {
    return firstValueFrom(this.GeniusClient.send('createVolunteer', volunteer));
  }

  @Put('update')
  async updateVolunteer(@Body() volunteer: Volunteer) {
    return firstValueFrom(this.GeniusClient.send('updateVolunteer', volunteer));
  }

  @Delete('remove')
  async deleteVolunteer(@Body() volunteer: Volunteer) {
    return firstValueFrom(this.GeniusClient.send('deleteVolunteer', volunteer));
  }
}
