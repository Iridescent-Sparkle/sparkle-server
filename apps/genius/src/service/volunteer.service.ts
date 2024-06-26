import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from '../entities/volunteer.entity';

@Injectable()
export class VolunteerService {
  @InjectRepository(Volunteer)
  private volunteerRepository: Repository<Volunteer>;

  constructor() {}

  async findVolunteerByUserId(userId: number) {
    return await this.volunteerRepository.find({
      where: {
        isDelete: false,
        user: {
          id: userId,
        },
      },
    });
  }

  async findVolunteerById(id: number) {
    return await this.volunteerRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
  }

  async createVolunteer(volunteer: Volunteer): Promise<Volunteer> {
    volunteer.profileId = volunteer.userId;
    return await this.volunteerRepository.save(volunteer);
  }

  async updateVolunteer(volunteer: Volunteer): Promise<any> {
    return await this.volunteerRepository.update(volunteer.id, volunteer);
  }

  async deleteVolunteer(id: number): Promise<void> {
    await this.volunteerRepository.update(id, { isDelete: true });
  }
}
