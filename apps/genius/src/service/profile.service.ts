import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'apps/user/src/entities/user.entity';
import { Between, Like, Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class ProfileService {
  @InjectRepository(Profile)
  private profileRepository: Repository<Profile>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor() {}
  async findAllProfile(params: Profile & Pagination) {
    const { current = 1, pageSize = 10, ...rest } = params;

    const condition: Record<string, any> = {};

    if (rest.address) {
      condition.address = Like(`%${rest.address}%`);
    }

    if (rest.minSalary && rest.maxSalary) {
      condition.minSalary = Between(rest.minSalary, rest.maxSalary);
      condition.maxSalary = Between(rest.minSalary, rest.maxSalary);
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

    const [data, total] = await this.profileRepository.findAndCount({
      where: {
        isDelete: false,
        ...rest,
        ...condition,
      },
      relations: {
        user: true,
        eduction: true,
        project: true,
        volunteer: true,
        experience: true,
      },
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

  async findProfileByUser(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: {
        isDelete: false,
        id: userId,
      },
      relations: {
        user: true,
        eduction: true,
        project: true,
        volunteer: true,
        experience: true,
      },
    });
    const res = {
      nickname: profile.user.nickname,
      avatar: profile.user.avatar,
      ...profile,
    };
    delete res.user;
    return res;
  }

  async createProfile(profile: Profile) {
    return await this.profileRepository.save(profile);
  }

  async updateProfile({
    userId,
    profile,
  }: {
    userId: number;
    profile: Profile & { nickname: string; avatar: string };
  }) {
    if (profile.nickname || profile.avatar) {
      await this.userRepository.update(userId, {
        nickname: profile.nickname,
        avatar: profile.avatar,
      });
    }

    return await this.profileRepository.update(profile.id, profile);
  }

  async deleteProfile(id: number) {
    await this.profileRepository.update(id, { isDelete: true });
  }
}
