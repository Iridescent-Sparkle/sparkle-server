import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobCollect } from 'apps/genius/src/entities/collect.entity';
import { JobDeliver } from 'apps/genius/src/entities/deliver.entity';
import { Between, In, Like, Repository } from 'typeorm';
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

  async findAll(params: JobDetail & Pagination) {
    const { page = 1, pageSize = 10, isFrozen = false, ...rest } = params;

    const condition: Record<string, any> = {};

    if (rest.address) {
      condition.address = Like(`%${rest.address}%`);
    }

    if (rest.jobBonus) {
      condition.JobBonus = In(rest.jobBonus);
    }

    if (rest.jobName) {
      condition.jobName = Like(`%${rest.jobName}%`);
    }

    if (rest.jobDescription) {
      condition.jobDescription = Like(`%${rest.jobDescription}%`);
    }

    if (rest.jobRequirements) {
      condition.jobRequirements = Like(`%${rest.jobRequirements}%`);
    }

    if (rest.minSalary && rest.maxSalary) {
      condition.minSalary = Between(rest.minSalary, rest.maxSalary);
      condition.maxSalary = Between(rest.minSalary, rest.maxSalary);
    }

    if (rest.createStart && rest.createEnd) {
      condition.createTime = Between(
        new Date(rest.createStart),
        new Date(new Date(rest.createEnd).getTime() + 60 * 60),
      );
    }

    if (rest.updateStart && rest.updateEnd) {
      condition.updateTime = Between(
        new Date(rest.updateStart),
        new Date(new Date(rest.updateEnd).getTime() + 60 * 60),
      );
    }

    const [data, total] = await this.jobDetailRepository.find({
      where: {
        isFrozen,
        isDelete: false,
        ...rest,
        ...condition,
      },
      relations: [
        'jobCategory',
        'jobBonus',
        'jobExperience',
        'jobEducation',
        'jobLevel',
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
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
