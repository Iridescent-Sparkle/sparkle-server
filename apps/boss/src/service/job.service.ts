import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobCollect } from 'apps/genius/src/entities/collect.entity';
import { JobDeliver } from 'apps/genius/src/entities/deliver.entity';
import { In, Repository } from 'typeorm';
import { JobDetail } from '../entities/job.entity';
import { JobBonus } from './../entities/bonus.entity';

@Injectable()
export class JobService {
  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(JobCollect)
  private jobCollectRepository: Repository<JobCollect>;

  @InjectRepository(JobDeliver)
  private jobDelivertRepository: Repository<JobDeliver>;

  @InjectRepository(JobBonus)
  private jobBonusRepository: Repository<JobBonus>;

  constructor() {}

  async create({
    userId,
    jobDetail,
  }: {
    userId: number;
    jobDetail: JobDetail;
  }) {
    jobDetail.userId = userId;

    jobDetail.jobBonus = await this.jobBonusRepository.findBy({
      id: In(jobDetail.jobBonus),
    });

    return await this.jobDetailRepository.save(jobDetail);
  }

  async findAll() {
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

  async findOne({ userId, jobId }: { userId: number; jobId: number }) {
    const jobDetail = (await this.jobDetailRepository.findOne({
      where: {
        id: jobId,
      },
      relations: {
        jobBonus: true,
        user: true,
      },
    })) as JobDetail & {
      isCollected: boolean;
      jobCollectId: number;
      jobDeliverStatus: number;
      jobDeliverId: number;
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

    const foundJobDeliver = await this.jobDelivertRepository.findOne({
      where: {
        jobId: jobId,
        userId: userId,
        isDelete: false,
      },
    });

    if (foundJobDeliver) {
      jobDetail.jobDeliverStatus = foundJobDeliver.status;
      jobDetail.jobDeliverId = foundJobDeliver.id;
    } else {
      jobDetail.jobDeliverStatus = 0;
    }
    return jobDetail;
  }

  async update({ jobId, jobDetail }: { jobId: number; jobDetail: JobDetail }) {
    await this.jobDetailRepository.update(jobId, jobDetail);
    return await this.jobDetailRepository.findOne({
      where: {
        id: jobId,
      },
    });
  }

  async remove({ jobId }: { jobId: number }) {
    await this.jobDetailRepository.delete(jobId);

    return {
      message: '删除成功',
    };
  }

  async search({ keyword }: { keyword: string }) {
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .where('jobDetail.jobName LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async paginate({ page, take }: { page: number; take: number }) {
    const skip = (page - 1) * take;
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .orderBy('jobDetail.id', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }
}
