import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IntegralService } from '../service/integral.service';
import { IntegralMeal } from '../entities/integral.entity';

@Controller()
export class IntegralController {
  constructor(private readonly integralService: IntegralService) {}

  @MessagePattern('initIntegralMeal')
  initIntegralMeal() {
    return this.integralService.initIntegralMeal();
  }

  @MessagePattern('findAllIntegralMeal')
  findAllIntegralMeal(params: IntegralMeal & Pagination) {
    return this.integralService.findAllIntegralMeal(params);
  }

  @MessagePattern('updateIntegralMeal')
  async updateIntegralMeal(params: IntegralMeal) {
    return await this.integralService.updateIntegralMeal(params);
  }

  @MessagePattern('createIntegralMeal')
  async createIntegralMeal(params: IntegralMeal) {
    return await this.integralService.createIntegralMeal(params);
  }

  @MessagePattern('rechargeIntegral')
  async rechargeIntegral(params: { integral: number; userId: number }) {
    return await this.integralService.rechargeIntegral(params);
  }

  @MessagePattern('consumeIntegral')
  async consumeIntegral(params: { integral: number; userId: number }) {
    return await this.integralService.consumeIntegral(params);
  }
}
