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

    const [data, total] = await this.jobDetailRepository.findAndCount({
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
        'company',
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

  async update({
    userId,
    jobId,
    jobDetail,
  }: {
    userId: number;
    jobId: number;
    jobDetail: JobDetail;
  }) {
    jobDetail.id = jobId;
    jobDetail.userId = userId;
    return await this.jobDetailRepository.save(jobDetail);
  }

  async remove({ jobId }: { jobId: number }) {
    await this.jobDetailRepository.update(jobId, {
      isDelete: true,
    });

    return {
      message: '删除成功',
    };
  }

  async findDeliverByJobId({ jobId }: { jobId: number }) {
    const res = await this.jobDelivertRepository.find({
      where: {
        jobId,
        isDelete: false,
      },
      relations: {
        user: {
          profile: {
            eduction: true,
            experience: true,
            project: true,
            volunteer: true,
          },
        },
      },
    });

    return res.map((item) => {
      return {
        ...item,
        eduction: item.user.profile.eduction,
        experience: item.user.profile.experience,
        project: item.user.profile.project,
        volunteer: item.user.profile.volunteer,
        address: item.user.profile.address,
        summary: item.user.profile.summary,
        id: item.user.profile.id,
        deliverId: item.id,
      };
    });
  }
}
