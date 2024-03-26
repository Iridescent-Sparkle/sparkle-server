import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { User } from 'apps/user/src/entities/user.entity';
import { Repository } from 'typeorm';
import { JobDeliver } from '../entities/deliver.entity';

@Injectable()
export class DeliveryService {
  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(JobDeliver)
  private jobDeliverRepository: Repository<JobDeliver>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor() {}

  async findDeliveryStatusByUserId({ userId }: { userId: number }) {
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
    return deliveryStatus.map((delivery) => delivery);
  }

  async createDelivery(deliveryData: {
    jobId: number;
    userId: number;
    status: number;
  }): Promise<JobDeliver> {
    const { jobId, userId, status } = deliveryData;

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

  async updateDeliveryStatus(deliveryData: {
    deliverId: number;
    status: number;
  }): Promise<JobDeliver> {
    const { deliverId, status: newStatus } = deliveryData;
    const delivery = await this.jobDeliverRepository.findOne({
      where: {
        id: deliverId,
      },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }
    delivery.status = newStatus;
    return await this.jobDeliverRepository.save(delivery);
  }

  async deleteDelivery(deliveryData: { deliverId: number }): Promise<void> {
    const { deliverId } = deliveryData;

    const delivery = await this.jobDeliverRepository.findOne({
      where: {
        id: deliverId,
      },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }
    await this.jobDeliverRepository.update(deliverId, {
      isDelete: true,
    });
  }
}
