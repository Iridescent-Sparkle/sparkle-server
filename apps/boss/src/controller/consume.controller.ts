import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IntegralRecord } from '../entities/consume.entity';
import { ConsumeService } from '../service/consume.service';

@Controller()
export class ConsumeController {
  constructor(private readonly consumeService: ConsumeService) {}

  @MessagePattern('findIntegralRecordByUserId')
  async findIntegralRecordByUserId(params: { userId: number } & Pagination) {
    return this.consumeService.findIntegralRecordByUserId(params);
  }

  @MessagePattern('createIntegralRecord')
  async createIntegralRecord(integralRecord: IntegralRecord) {
    return this.consumeService.createIntegralRecord(integralRecord);
  }

  @MessagePattern('queryUsageByType')
  async queryUsageByType(userId: number) {
    return this.consumeService.queryUsageByType(userId);
  }

  @MessagePattern('queryConsumptionLast7Days')
  async queryConsumptionLast7Days(userId: number) {
    return this.consumeService.queryConsumptionLast7Days(userId);
  }
}
