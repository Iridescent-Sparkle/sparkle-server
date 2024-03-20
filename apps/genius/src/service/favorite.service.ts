import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { User } from 'apps/user/src/entities/user.entity';
import { Repository } from 'typeorm';
import { JobCollect } from '../entities/collect.entity';

@Injectable()
export class FavoriteService {
  @InjectRepository(JobCollect)
  private jobCollectRepository: Repository<JobCollect>;

  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor() {}

  async findFavoritesByUserId(userId: number): Promise<JobDetail[]> {
    const favoriteJobs = await this.jobCollectRepository.find({
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

    return favoriteJobs.map((item) => item.job);
  }

  async addJobToCollection(jobId: number, userId: number): Promise<JobCollect> {
    const jobDetail = await this.jobDetailRepository.findOne({
      where: { id: jobId },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const newJobCollect = this.jobCollectRepository.create({
      job: jobDetail,
      user: user,
    });

    return await this.jobCollectRepository.save(newJobCollect);
  }

  async removeJobFromCollection(
    jobCollectId: number,
    userId: number,
  ): Promise<void> {
    const jobCollect = await this.jobCollectRepository.findOne({
      where: {
        id: jobCollectId,
        user: {
          id: userId,
        },
      },
    });

    if (!jobCollect) {
      throw new BadRequestException('Job collect not found');
    }

    await this.jobCollectRepository.update(jobCollectId, { isDelete: true });
  }
}
