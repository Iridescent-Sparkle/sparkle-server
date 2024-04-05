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
    await this.integralService.updateIntegralMeal(params);
  }
}
