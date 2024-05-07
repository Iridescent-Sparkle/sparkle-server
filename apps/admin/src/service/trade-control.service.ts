import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeControl } from '../entities/trade.entity';

@Injectable()
export class TradeControlService {
  constructor(
    @InjectRepository(TradeControl)
    private readonly tradeControlRepository: Repository<TradeControl>,
  ) {}

  async findAllTradeControl(params: Pagination) {
    const { current = 1, pageSize = 10 } = params;
    const [data, total] = await this.tradeControlRepository.findAndCount({
      skip: (current - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      current,
      pageSize,
    };
  }

  async updateTradeControl(params: TradeControl) {
    return this.tradeControlRepository.update(params.id, params);
  }

  async createTradeControl(params: TradeControl) {
    return this.tradeControlRepository.save(params);
  }
}
