import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobExperience } from '../entities/experience.entity';

@Injectable()
export class ExperienceService {
  @InjectRepository(JobExperience)
  private jobexperienceRepository: Repository<JobExperience>;

  constructor() {}

  async initJobExperience() {
    const workExperienceOptions = [
      {
        label: '1年以下',
        value: '1',
      },
      {
        label: '1-3年',
        value: '2',
      },
      {
        label: '3-5年',
        value: '3',
      },
      {
        label: '5-10年',
        value: '4',
      },
      {
        label: '10年以上',
        value: '5',
      },
    ];
    for await (const item of workExperienceOptions) {
      const jobExperience = new JobExperience();
      jobExperience.experienceName = item.label;
      await this.jobexperienceRepository.save(jobExperience);
    }
    return {};
  }

  async findAllJobExperience(): Promise<JobExperience[]> {
    return await this.jobexperienceRepository.find({
      where: {
        isDelete: false,
      },
    });
  }
}
