import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobLevel } from '../entities/level.entity';

@Injectable()
export class LevelService {
  @InjectRepository(JobLevel)
  private jobLevelRepository: Repository<JobLevel>;

  constructor() {}

  async initJobLevel() {
    const worklevelOptions = [
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
    for await (const item of worklevelOptions) {
      const jobLevel = new JobLevel();
      jobLevel.levelName = item.label;
      await this.jobLevelRepository.save(jobLevel);
    }
    return {};
  }

  async findAllJobLevel(): Promise<JobLevel[]> {
    return await this.jobLevelRepository.find({
      where: {
        isDelete: false,
      },
    });
  }
}
