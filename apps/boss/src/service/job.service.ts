import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobCollect } from 'apps/genius/src/entities/collect.entity';
import { In, Repository } from 'typeorm';
import { JobDetail } from '../entities/job.entity';
import { JobBonus } from './../entities/bonus.entity';

@Injectable()
export class JobService {
  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(JobCollect)
  private jobCollectRepository: Repository<JobCollect>;

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

  async findOne({ userId, jobId }: { userId: number; jobId: number }): Promise<
    JobDetail & {
      isCollected: boolean;
      jobCollectId: number;
    }
  > {
    const jobDetail = (await this.jobDetailRepository.findOne({
      where: {
        id: jobId,
      },
      relations: ['jobBonus'],
    })) as JobDetail & {
      isCollected: boolean;
      jobCollectId: number;
    };

    const foundJobCollect = await this.jobCollectRepository.findOne({
      where: {
        jobId: jobId,
        userId: userId,
        isDelete: false,
      },
    });

    if (foundJobCollect) {
      jobDetail.isCollected = true;
      jobDetail.jobCollectId = foundJobCollect.id;
    } else {
      jobDetail.isCollected = false;
    }
    return jobDetail;
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
