import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegralRecord } from '../entities/consume.entity';

@Injectable()
export class ConsumeService {
  @InjectRepository(IntegralRecord)
  private integralRecordRepository: Repository<IntegralRecord>;

  constructor() {}

  async findIntegralRecordByUserId(params: { userId: number } & Pagination) {
    const { current = 1, pageSize = 10 } = params;

    const [data, total] = await this.integralRecordRepository.findAndCount({
      where: {
        userId: params.userId,
      },
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    console.log(data, total);
    return {
      data,
      total,
      current,
      pageSize,
    };
  }

  async createIntegralRecord(integralRecord: IntegralRecord) {
    const newIntegralRecord = new IntegralRecord();
    newIntegralRecord.userId = integralRecord.userId;
    newIntegralRecord.integral = integralRecord.integral;
    newIntegralRecord.type = integralRecord.type;
    newIntegralRecord.isConsume = integralRecord.isConsume;
    return await this.integralRecordRepository.save(integralRecord);
  }

  async queryUsageByType(userId: number) {
    return await this.integralRecordRepository
      .createQueryBuilder('integralRecord')
      .select('type')
      .addSelect('SUM(integral)', 'totalIntegral')
      .where({
        isDelete: false,
        user: {
          id: userId,
        },
      })
      .groupBy('type')
      .getRawMany();
  }

  async queryConsumptionLast7Days(userId: number) {
    const result = await this.integralRecordRepository
      .createQueryBuilder('integralRecord')
      .select('DATE(createTime)', 'date')
      .addSelect('SUM(integral)', 'totalIntegral')
      .where('createTime > :date', {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      })
      .andWhere({
        isConsume: true,
        isDelete: false,
        user: {
          id: userId,
        },
      })
      .groupBy('DATE(createTime)')
      .getRawMany();

    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      dates.push(date.toISOString().split('T')[0]);
    }

    const resultMap = {};
    result.forEach((item) => {
      resultMap[item.date.toISOString().split('T')[0]] = item.totalIntegral;
    });

    const finalResult = dates.map((date) => ({
      label: [date.split('-')[1], date.split('-')[2]].join('-'),
      value: resultMap[date] || 0,
    }));

    return finalResult;
  }
}
