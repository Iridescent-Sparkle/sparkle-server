import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobCollect } from '../entities/collect.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class FavoriteService {
  @InjectRepository(JobCollect)
  private jobCollectRepository: Repository<JobCollect>;

  constructor() {}

  async findFavoritesByUserId(userId: number): Promise<JobCollect[]> {
    return await this.jobCollectRepository.find({
      where: {
        user: {
          id: userId,
        },
        isDelete: false,
      },
      relations: {
        job: true,
      },
    });
  }

  async addJobToCollection(jobData: {
    userId: number;
    jobId: number;
  }): Promise<JobCollect> {
    const { userId, jobId } = jobData;
    const foundJobCollect = await this.jobCollectRepository.findOne({
      where: {
        userId,
        jobId,
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
