import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Volunteer } from '../entities/volunteer.entity';
import { VolunteerService } from '../service/volunteer.service';

@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @MessagePattern('findVolunteer')
  async findVolunteer(userId: number) {
    return this.volunteerService.findVolunteer(userId);
  }

  @MessagePattern('createVolunteer')
  async createVolunteer(volunteer: Volunteer) {
    return this.volunteerService.createVolunteer(volunteer);
  }

  @MessagePattern('updateVolunteer')
  async updateVolunteer(volunteer: Volunteer) {
    return this.volunteerService.updateVolunteer(volunteer);
  }

  @MessagePattern('deleteVolunteer')
  async deleteVolunteer(volunteer: Volunteer) {
    return this.volunteerService.deleteVolunteer(volunteer.id);
  }
}
