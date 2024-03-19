import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobCollect } from './entities/collect.entity';
import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { In, Repository } from 'typeorm';
import { JobDeliver } from './entities/deliver.entity';

@Injectable()
export class GeniusService {
  constructor(
    @InjectRepository(JobCollect)
    private jobCollectRepository: Repository<JobCollect>,
    @InjectRepository(JobDetail)
    private jobDetailRepository: Repository<JobDetail>,
    @InjectRepository(JobDeliver)
    private jobDeliverRepository: Repository<JobDeliver>,
  ) {}

  async findFavoritesByUserId(userId: number): Promise<JobDetail[]> {
    const favoriteJobs = await this.jobCollectRepository.find({
      where: { userId },
    });
    const favoriteJobIds = favoriteJobs.map((favorite) => favorite.jobId);
    return await this.jobDetailRepository.find({
      where: { id: favoriteJobIds },
    });
  }

  async addJobToCollection(jobId: number, userId: number): Promise<JobCollect> {
    const newJobCollect = this.jobCollectRepository.create({ jobId, userId });
    return await this.jobCollectRepository.save(newJobCollect);
  }

  async removeJobFromCollection(jobCollectId: number): Promise<void> {
    const jobCollect = await this.jobCollectRepository.findOne({
      where: { id: jobCollectId },
    });
    if (!jobCollect) {
      throw new Error('Job collect not found');
    }
    await this.jobCollectRepository.remove(jobCollect);
  }

  async updateJobCollection(
    jobCollectId: number,
    newJobId: number,
  ): Promise<JobCollect> {
    const jobCollect = await this.jobCollectRepository.findOne({
      where: { id: jobCollectId },
    });
    if (!jobCollect) {
      throw new Error('Job collect not found');
    }
    jobCollect.jobId = newJobId;
    return await this.jobCollectRepository.save(jobCollect);
  }

  async findDeliveryStatusByUserId(userId: number): Promise<JobDetail[]> {
    const deliveryStatus = await this.jobDeliverRepository.find({
      where: { userId },
    });
    const deliveryJobIds = deliveryStatus.map((delivery) => delivery.jobId);
    return await this.jobDetailRepository.find({
      where: { id: In(deliveryJobIds) },
    });
  }

  async createDelivery(jobId: number, userId: number): Promise<JobDeliver> {
    const newDelivery = this.jobDeliverRepository.create({
      jobId,
      userId,
      status: 1,
    });
    return await this.jobDeliverRepository.save(newDelivery);
  }

  async updateDeliveryStatus(
    deliveryId: number,
    newStatus: number,
  ): Promise<JobDeliver> {
    const delivery = await this.jobDeliverRepository.findOne({
      where: {
        id: deliveryId,
      },
    });
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    delivery.status = newStatus;
    return await this.jobDeliverRepository.save(delivery);
  }

  async deleteDelivery(deliveryId: number): Promise<void> {
    const delivery = await this.jobDeliverRepository.findOne({
      where: {
        id: deliveryId,
      },
    });
    if (!delivery) {
      throw new Error('Delivery not found');
    }
    await this.jobDeliverRepository.remove(delivery);
  }
}
