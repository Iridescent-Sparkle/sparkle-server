import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDetail } from './entities/job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BossService {
  constructor(
    @InjectRepository(JobDetail)
    private jobDetailRepository: Repository<JobDetail>,
  ) {}

  async create(jobDetail: JobDetail): Promise<JobDetail> {
    return await this.jobDetailRepository.save(jobDetail);
  }

  async findAll(): Promise<JobDetail[]> {
    return await this.jobDetailRepository.find();
  }

  async findOne(id: number): Promise<JobDetail> {
    return await this.jobDetailRepository.findOne(id);
  }

  async update(id: number, jobDetail: JobDetail): Promise<JobDetail> {
    await this.jobDetailRepository.update(id, jobDetail);
    return await this.jobDetailRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.jobDetailRepository.delete(id);
  }

  async search(keyword: string): Promise<JobDetail[]> {
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .where('jobDetail.jobName LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async paginate(page: number, take: number): Promise<JobDetail[]> {
    const skip = (page - 1) * take;
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .orderBy('jobDetail.id', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }
}
