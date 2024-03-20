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

  async findDeliveryStatusByUserId(userId: number): Promise<JobDetail[]> {
    const deliveryStatus = await this.jobDeliverRepository.find({
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
    return deliveryStatus.map((delivery) => delivery.job);
  }

  async createDelivery(
    jobId: number,
    userId: number,
    status: number,
  ): Promise<JobDeliver> {
    const job = await this.jobDetailRepository.findOne({
      where: { id: jobId },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const newDelivery = this.jobDeliverRepository.create({
      job,
      user,
      status,
    });

    return await this.jobDeliverRepository.save(newDelivery);
  }

  async updateDeliveryStatus(
    jobId: number,
    userId: number,
    newStatus: number,
  ): Promise<JobDeliver> {
    const delivery = await this.jobDeliverRepository.findOne({
      where: {
        id: jobId,
        user: {
          id: userId,
        },
      },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }
    delivery.status = newStatus;
    return await this.jobDeliverRepository.save(delivery);
  }

  async deleteDelivery(deliveryId: number, userId: number): Promise<void> {
    const delivery = await this.jobDeliverRepository.findOne({
      where: {
        id: deliveryId,
        user: {
          id: userId,
        },
      },
    });
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    await this.jobDeliverRepository.update(deliveryId, {
      isDelete: true,
    });
  }
}
