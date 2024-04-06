import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IntegralRecord } from '../entities/consume.entity';
import { ConsumeService } from '../service/consume.service';

@Controller()
export class ConsumeController {
  constructor(private readonly consumeService: ConsumeService) {}

  @MessagePattern('findIntegralRecordByUserId')
  async findIntegralRecordByUserId(userId: number) {
    return this.consumeService.findIntegralRecordByUserId(userId);
  }

  @MessagePattern('createIntegralRecord')
  async createIntegralRecord(integralRecord: IntegralRecord) {
    return this.consumeService.createIntegralRecord(integralRecord);
  }
}
