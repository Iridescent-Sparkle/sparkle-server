import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from '../entities/education.entity';

@Injectable()
export class EducationService {
  @InjectRepository(Education)
  private educationRepository: Repository<Education>;

  constructor() {}

  async findEducationByUserId(userId: number) {
    return await this.educationRepository.find({
      where: {
        isDelete: false,
        user: {
          id: userId,
        },
      },
    });
  }

  async findEducationById(id: number) {
    return await this.educationRepository.findOne({
      where: {
        isDelete: false,
        id,
      },
    });
  }

  async createEducation(education: Education): Promise<Education> {
    education.profileId = education.userId;
    return await this.educationRepository.save(education);
  }

  async updateEducation(education: Education): Promise<any> {
    return await this.educationRepository.update(education.id, education);
  }

  async deleteEducation(id: number): Promise<void> {
    await this.educationRepository.update(id, { isDelete: true });
  }
}
