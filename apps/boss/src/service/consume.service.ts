import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegralRecord } from '../entities/consume.entity';

@Injectable()
export class ConsumeService {
  @InjectRepository(IntegralRecord)
  private integralRecordRepository: Repository<IntegralRecord>;

  constructor() {}
  async findIntegralRecordByUserId(userId: number) {
    return await this.integralRecordRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  async createIntegralRecord(integralRecord: IntegralRecord) {
    const newIntegralRecord = new IntegralRecord();
    newIntegralRecord.userId = integralRecord.userId;
    newIntegralRecord.integral = integralRecord.integral;
    newIntegralRecord.type = integralRecord.type;
    return await this.integralRecordRepository.save(integralRecord);
  }
}
