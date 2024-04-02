import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEducation } from '../entities/education.entity';

@Injectable()
export class EducationService {
  @InjectRepository(JobEducation)
  private jobEducationRepository: Repository<JobEducation>;

  constructor() {}

  async initJobEducation() {
    const educationRequirementOptions = [
      {
        label: '不限',
        value: '0',
      },
      {
        label: '初中及以下',
        value: '1',
      },
      {
        label: '高中',
        value: '2',
      },
      {
        label: '大专',
        value: '3',
      },
      {
        label: '本科',
        value: '4',
      },
      {
        label: '硕士',
        value: '5',
      },
      {
        label: '博士',
        value: '6',
      },
    ];
    for await (const item of educationRequirementOptions) {
      const jobEducation = new JobEducation();
      jobEducation.educationName = item.label;
      await this.jobEducationRepository.save(jobEducation);
    }
    return {};
  }

  async findAllJobEducation(): Promise<JobEducation[]> {
    return await this.jobEducationRepository.find({
      where: {
        isDelete: false,
      },
    });
  }
}
