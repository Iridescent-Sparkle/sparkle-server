import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/user/src/entities/user.entity';
import { Between, Like, Repository } from 'typeorm';

@Injectable()
export class CustomUserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async updateCustomUser(user: User) {
    const foundUser = await this.userRepository.findOneBy({
      id: user.id,
    });

    if (user.username) {
      foundUser.username = user.username;
    }

    if (user.isFrozen !== undefined) {
      foundUser.isFrozen = user.isFrozen;
    }

    return await this.userRepository.save(foundUser);
  }

  async findAllCustomUser(params: User & Pagination) {
    const { current = 1, pageSize = 10, ...rest } = params;

    const condition: Record<string, any> = {
      id: rest.id,
    };

    if (rest.username) {
      condition.username = Like(`%${rest.username}%`);
    }

    if (rest.nickname) {
      condition.nickname = Like(`%${rest.nickname}%`);
    }

    if (rest.createTime) {
      condition.createTime = Between(
        new Date(rest.createTime[0]),
        new Date(rest.createTime[1]),
      );
    }

    if (rest.updateTime) {
      condition.updateTime = Between(
        new Date(rest.updateTime[0]),
        new Date(rest.updateTime[1]),
      );
    }

    if (rest.isFrozen !== undefined) {
      condition.isFrozen = rest.isFrozen;
    }

    const [data, total] = await this.userRepository.findAndCount({
      where: condition,
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
}
