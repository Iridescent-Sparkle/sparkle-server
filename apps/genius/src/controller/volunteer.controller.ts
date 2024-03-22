import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Volunteer } from '../entities/volunteer.entity';
import { VolunteerService } from '../service/volunteer.service';

@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Get('user/:userId')
  async findVolunteer(@Param('userId') userId: number) {
    return this.volunteerService.findVolunteer(userId);
  }

  @Post('create')
  async createVolunteer(@Body() volunteer: Volunteer) {
    return this.volunteerService.createVolunteer(volunteer);
  }

  @Put('update')
  async updateVolunteer(@Body() volunteer: Volunteer) {
    return this.volunteerService.updateVolunteer(volunteer);
  }

  @Delete('remove')
  async deleteVolunteer(@Body() volunteer: Volunteer) {
    return this.volunteerService.deleteVolunteer(volunteer.id);
  }
}
