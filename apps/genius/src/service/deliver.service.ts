import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { User } from 'apps/user/src/entities/user.entity';
import { Repository } from 'typeorm';
import { JobDeliver } from '../entities/deliver.entity';

@Injectable()
export class DeliverService {
  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(JobDeliver)
  private jobDeliverRepository: Repository<JobDeliver>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor() {}

  async findDeliverStatusByUserId({ userId }: { userId: number }) {
    const deliverStatus = await this.jobDeliverRepository.find({
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
    return deliverStatus.map((deliver) => deliver);
  }

  async createDeliver(deliverData: {
    jobId: number;
    userId: number;
    status: number;
  }): Promise<JobDeliver> {
    const { jobId, userId, status } = deliverData;

    const job = await this.jobDetailRepository.findOne({
      where: { id: jobId },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const newDeliver = this.jobDeliverRepository.create({
      job,
      user,
      status,
    });

    return await this.jobDeliverRepository.save(newDeliver);
  }

  async updateDeliverStatus(deliverData: {
    deliverId: number;
    status: number;
  }): Promise<JobDeliver> {
    const { deliverId, status: newStatus } = deliverData;
    const deliver = await this.jobDeliverRepository.findOne({
      where: {
        id: deliverId,
      },
    });

    if (!deliver) {
      throw new Error('Deliver not found');
    }
    deliver.status = newStatus;
    return await this.jobDeliverRepository.save(deliver);
  }

  async deleteDeliver(deliverData: { deliverId: number }): Promise<void> {
    const { deliverId } = deliverData;

    const deliver = await this.jobDeliverRepository.findOne({
      where: {
        id: deliverId,
      },
    });

    if (!deliver) {
      throw new Error('Deliver not found');
    }
    await this.jobDeliverRepository.update(deliverId, {
      isDelete: true,
    });
  }
}
