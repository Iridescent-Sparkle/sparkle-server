import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from '../entities/education.entity';

@Injectable()
export class EducationService {
  @InjectRepository(Education)
  private jobDetailRepository: Repository<Education>;

  @InjectRepository(Education)
  private jobDeliverRepository: Repository<Education>;

  @InjectRepository(Education)
  private educationRepository: Repository<Education>;

  constructor() {}

  async findEducationByUserId(userId: number) {
    return await this.educationRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async createEducation(education: Education): Promise<Education> {
    return await this.educationRepository.save(education);
  }
  async updateEducation(education: Education): Promise<any> {
    return await this.educationRepository.update(education.id, {
      id: education.id,
      school: education.school,
      profession: education.profession,
      startTime: education.startTime,
      endTime: education.endTime,
      graduate: education.graduate,
      gpa: education.gpa,
      totalGpa: education.totalGpa,
      description: education.description,
    });
  }

  async deleteEducation(id: number): Promise<void> {
    await this.educationRepository.update(id, { isDelete: true });
  }
}
