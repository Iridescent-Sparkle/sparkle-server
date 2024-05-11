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
        label: '实习',
        value: '1',
      },
      {
        label: '初级',
        value: '2',
      },
      {
        label: '中级',
        value: '3',
      },
      {
        label: '高级',
        value: '4',
      },
      {
        label: '组长',
        value: '5',
      },
      {
        label: '专家',
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
