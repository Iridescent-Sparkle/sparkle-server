import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCategory } from '../entities/category.entity';
import { JobDetail } from '../entities/job.entity';

@Injectable()
export class CategoryService {
  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(JobCategory)
  private jobCategoryRepository: Repository<JobCategory>;

  constructor() {}

  async findAllJobCategory(): Promise<JobCategory[]> {
    return await this.jobCategoryRepository.find();
  }

  async findJobByCategory({
    categoryId,
  }: {
    categoryId: number;
  }): Promise<JobDetail[]> {
    if (categoryId == 0) {
      return await this.jobDetailRepository.find();
    }

    return await this.jobDetailRepository.find({
      where: {
        jobCategory: {
          id: categoryId,
        },
      },
    });
  }
}
