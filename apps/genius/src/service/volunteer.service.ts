import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from '../entities/volunteer.entity';

@Injectable()
export class VolunteerService {
  @InjectRepository(Volunteer)
  private volunteerRepository: Repository<Volunteer>;

  constructor() {}

  async findVolunteer(userId: number) {
    return await this.volunteerRepository.find({
      where: {
        isDelete: false,
        user: {
          id: userId,
        },
      },
    });
  }

  async createVolunteer(volunteer: Volunteer): Promise<Volunteer> {
    return await this.volunteerRepository.save(volunteer);
  }

  async updateVolunteer(volunteer: Volunteer): Promise<any> {
    return await this.volunteerRepository.update(volunteer.id, volunteer);
  }

  async deleteVolunteer(id: number): Promise<void> {
    await this.volunteerRepository.update(id, { isDelete: true });
  }
}
