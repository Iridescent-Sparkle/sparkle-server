import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';

@Injectable()
export class ExperienceService {
  @InjectRepository(Experience)
  private ExperienceRepository: Repository<Experience>;

  constructor() {}

  async findExperienceByUserId(userId: number) {
    return await this.ExperienceRepository.find({
      where: {
        isDelete: false,
        user: {
          id: userId,
        },
      },
    });
  }

  async findExperienceById(id: number) {
    return await this.ExperienceRepository.findOne({
      where: {
        isDelete: false,
        id,
      },
    });
  }

  async createExperience(experience: Experience): Promise<Experience> {
    experience.profileId = experience.userId;
    return await this.ExperienceRepository.save(experience);
  }
  async updateExperience(experience: Experience): Promise<any> {
    return await this.ExperienceRepository.update(experience.id, experience);
  }

  async deleteExperience(id: number): Promise<void> {
    await this.ExperienceRepository.update(id, { isDelete: true });
  }
}
