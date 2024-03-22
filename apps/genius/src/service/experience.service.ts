import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/user/src/entities/user.entity';
import { Repository } from 'typeorm';
import { Experience } from '../entities/Experience.entity';

@Injectable()
export class ExperienceService {
  @InjectRepository(Experience)
  private jobDetailRepository: Repository<Experience>;

  @InjectRepository(Experience)
  private jobDeliverRepository: Repository<Experience>;

  @InjectRepository(Experience)
  private ExperienceRepository: Repository<Experience>;

  constructor() {}

  async findExperienceByUserId(userId: number) {
    return await this.ExperienceRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createExperience(experience: Experience): Promise<Experience> {
    return await this.ExperienceRepository.save(experience);
  }
  async updateExperience(experience: Experience): Promise<any> {
    return await this.ExperienceRepository.update(experience.id, experience);
  }

  async deleteExperience(id: number): Promise<void> {
    await this.ExperienceRepository.update(id, { isDelete: true });
  }
}
