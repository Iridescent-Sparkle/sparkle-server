import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobDeliver } from '../entities/deliver.entity';

@Injectable()
export class DeliverService {
  @InjectRepository(JobDeliver)
  private jobDeliverRepository: Repository<JobDeliver>;

  constructor() {}

  async findDeliverStatusByUserId({ userId }: { userId: number }) {
    const jobDeliver = await this.jobDeliverRepository.find({
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

    // status:0 未投递 1 已投递 2 已查看 3 已通过 4 已拒绝
    return jobDeliver.map((deliver) => ({
      ...deliver.job,
      jobDeliverId: deliver.id,
      jobDeliverStatus: deliver.status,
    }));
  }

  async findDeliverStatusByJobId(deliverData: { deliverId: number }) {
    const { deliverId } = deliverData;
    console.log(deliverId);
    return await this.jobDeliverRepository.findOne({
      where: {
        id: deliverId,
        isDelete: false,
      },
      relations: {
        user: true,
      },
    });
    // status:0 未投递 1 已投递 2 已查看3 已通过 4 已拒绝
  }
  async createDeliver(deliverData: { jobId: number; userId: number }) {
    const { jobId, userId } = deliverData;

    const foundJobCollect = await this.jobDeliverRepository.findOne({
      where: {
        userId,
        jobId,
        isDelete: false,
      },
    });

    if (foundJobCollect) {
      throw new RpcException({
        message: '已经投递该职位',
        code: HttpStatus.BAD_REQUEST,
      });
    }
    const newDeliver = this.jobDeliverRepository.create({
      jobId,
      userId,
      status: 1,
    });

    return await this.jobDeliverRepository.save(newDeliver);
  }

  async updateDeliverStatus(deliverData: {
    deliverId: number;
    status: number;
  }) {
    const { deliverId, status: newStatus } = deliverData;
    const deliver = await this.jobDeliverRepository.findOne({
      where: {
        id: deliverId,
      },
    });

    if (!deliver) {
      throw new RpcException({
        message: '未找到该投递信息',
        code: HttpStatus.BAD_REQUEST,
      });
    }
    deliver.status = newStatus;
    console.log(deliver);
    return await this.jobDeliverRepository.save(deliver);
  }

  async deleteDeliver(deliverData: { deliverId: number }) {
    const { deliverId } = deliverData;

    const deliver = await this.jobDeliverRepository.findOne({
      where: {
        id: deliverId,
      },
    });

    if (!deliver) {
      throw new RpcException({
        message: '未找到该投递信息',
        code: HttpStatus.BAD_REQUEST,
      });
    }
    await this.jobDeliverRepository.update(deliverId, {
      isDelete: true,
    });

    return {
      message: '删除成功',
    };
  }
}
