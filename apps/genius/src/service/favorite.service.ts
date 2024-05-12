import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCollect } from '../entities/collect.entity';

@Injectable()
export class FavoriteService {
  @InjectRepository(JobCollect)
  private jobCollectRepository: Repository<JobCollect>;

  constructor() {}

  async findFavoritesByUserId(userId: number) {
    const jobCollect = await this.jobCollectRepository.find({
      where: {
        user: {
          id: userId,
        },
        isDelete: false,
      },
      relations: {
        job: {
          company: true,
        },
      },
    });
    return jobCollect.map((item) => ({
      ...item.job,
      jobCollectId: item.id,
      isCollected: true,
    }));
  }

  async addJobToCollection(jobData: { userId: number; jobId: number }) {
    const { userId, jobId } = jobData;
    const foundJobCollect = await this.jobCollectRepository.findOne({
      where: {
        userId,
        jobId,
        isDelete: false,
      },
    });

    if (foundJobCollect) {
      throw new RpcException({
        message: '已经收藏该职位',
        code: HttpStatus.BAD_REQUEST,
      });
    }
    const jobCollect = new JobCollect();

    jobCollect.userId = jobData.userId;
    jobCollect.jobId = jobData.jobId;

    return await this.jobCollectRepository.save(jobCollect);
  }

  async removeJobFromCollection(jobData: { favoriteId: number }) {
    const jobCollect = await this.jobCollectRepository.findOne({
      where: {
        id: jobData.favoriteId,
      },
    });

    if (!jobCollect) {
      throw new BadRequestException('Job collect not found');
    }

    await this.jobCollectRepository.update(jobData.favoriteId, {
      isDelete: true,
    });

    return {
      message: 'Remove job collect success',
    };
  }
}
