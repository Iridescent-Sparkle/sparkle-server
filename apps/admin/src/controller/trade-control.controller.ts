import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TradeControl } from '../entities/trade.entity';
import { TradeControlService } from '../service/trade-control.service';

@Controller()
export class TradeControlController {
  constructor(private readonly tradeControlService: TradeControlService) {}

  @MessagePattern('findAllTradeControl')
  async findAllTradeControl(params: Pagination) {
    return await this.tradeControlService.findAllTradeControl(params);
  }

  @MessagePattern('createTradeControl')
  async createTradeControl(params: TradeControl) {
    return await this.tradeControlService.createTradeControl(params);
  }

  @MessagePattern('updateTradeControl')
  async updateTradeControl(params: TradeControl) {
    return await this.tradeControlService.updateTradeControl(params);
  }
}
