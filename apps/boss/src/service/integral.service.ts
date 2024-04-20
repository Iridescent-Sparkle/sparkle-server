import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { IntegralMeal } from '../entities/integral.entity';
import { User } from 'apps/user/src/entities/user.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class IntegralService {
  @InjectRepository(IntegralMeal)
  private integralMealRepository: Repository<IntegralMeal>;
  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor() {}

  async initIntegralMeal() {
    const integralMealArr = [
      {
        integralNum: 15,
        price: 20,
      },
      {
        integralNum: 30,
        price: 29,
      },
      {
        integralNum: 60,
        price: 55,
      },
      {
        integralNum: 120,
        price: 100,
      },
    ];
    for await (const item of integralMealArr) {
      const integralMeal = new IntegralMeal();
      integralMeal.integralNum = item.integralNum;
      integralMeal.price = item.price;
      await this.integralMealRepository.save(integralMeal);
    }
    return {};
  }

  async findAllIntegralMeal(params: IntegralMeal & Pagination) {
    const { page = 1, pageSize = 10, isFrozen = false, ...rest } = params;

    const condition: Record<string, any> = {};

    if (rest.createStart && rest.createEnd) {
      condition.createTime = Between(
        new Date(rest.createStart),
        new Date(new Date(rest.createEnd).getTime() + 60 * 60),
      );
    }

    if (rest.updateStart && rest.updateEnd) {
      condition.updateTime = Between(
        new Date(rest.updateStart),
        new Date(new Date(rest.updateEnd).getTime() + 60 * 60),
      );
    }

    const [data, total] = await this.integralMealRepository.findAndCount({
      where: {
        isDelete: false,
        isFrozen,
        ...condition,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async updateIntegralMeal(params: IntegralMeal) {
    await this.integralMealRepository.update(params.id, params);
  }

  async createIntegralMeal(params: IntegralMeal) {
    const integralMeal = new IntegralMeal();
    integralMeal.integralNum = params.integralNum;
    integralMeal.price = params.price;
    await this.integralMealRepository.save(integralMeal);
  }

  async deleteIntegralMeal(id: number) {
    await this.integralMealRepository.update(id, {
      isDelete: true,
    });
  }

  async rechargeIntegral(params: { integral: number; userId: number }) {
    const { integral, userId } = params;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return await this.userRepository.update(userId, {
      integral: user.integral + integral,
    });
  }

  async consumeIntegral(params: { integral: number; userId: number }) {
    const { integral, userId } = params;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (user.integral < integral) {
      throw new RpcException({
        message: '积分不足',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return await this.userRepository.update(userId, {
      integral: user.integral - integral,
    });
  }
}
