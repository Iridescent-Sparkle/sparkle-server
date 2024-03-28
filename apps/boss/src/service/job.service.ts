import { JobBonus } from './../entities/bonus.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDetail } from '../entities/job.entity';
import { In, Repository } from 'typeorm';
import { JobCategory } from '../entities/category.entity';
import { User } from 'apps/user/src/entities/user.entity';

@Injectable()
export class JobService {
  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(JobCategory)
  private jobCategoryRepository: Repository<JobCategory>;

  @InjectRepository(JobBonus)
  private jobBonusRepository: Repository<JobBonus>;

  constructor() {}

  async create({
    userId,
    jobDetail,
  }: {
    userId: number;
    jobDetail: JobDetail;
  }): Promise<JobDetail> {
    jobDetail.userId = userId;

    jobDetail.jobBonus = await this.jobBonusRepository.findBy({
      id: In(jobDetail.jobBonus),
    });
    console.log(jobDetail.jobBonus);
    return await this.jobDetailRepository.save(jobDetail);
  }

  async findAll(): Promise<JobDetail[]> {
    return await this.jobDetailRepository.find({
      relations: [
        'jobCategory',
        'jobBonus',
        'jobExperience',
        'jobEducation',
        'jobLevel',
      ],
    });
  }

  async findOne({ jobId }: { jobId: number }): Promise<JobDetail> {
    return await this.jobDetailRepository.findOne({
      where: {
        id: jobId,
      },
    });
  }

  async update({
    jobId,
    jobDetail,
  }: {
    jobId: number;
    jobDetail: JobDetail;
  }): Promise<JobDetail> {
    await this.jobDetailRepository.update(jobId, jobDetail);
    return await this.jobDetailRepository.findOne({
      where: {
        id: jobId,
      },
    });
  }

  async remove({ jobId }: { jobId: number }): Promise<void> {
    await this.jobDetailRepository.delete(jobId);
  }

  async search({ keyword }: { keyword: string }): Promise<JobDetail[]> {
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .where('jobDetail.jobName LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async paginate({
    page,
    take,
  }: {
    page: number;
    take: number;
  }): Promise<JobDetail[]> {
    const skip = (page - 1) * take;
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .orderBy('jobDetail.id', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }
}
