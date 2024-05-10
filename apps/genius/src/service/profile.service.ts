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

    if (rest.isHunting !== undefined) {
      condition.isHunting = rest.isHunting;
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
    const foundUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (profile.nickname) {
      foundUser.nickname = profile.nickname;
    }

    if (profile.avatar) {
      foundUser.avatar = profile.avatar;
    }

    if (profile.occupation) {
      foundUser.occupation = profile.occupation;
    }

    await this.userRepository.update(userId, foundUser);

    const foundProfile = await this.profileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return await this.profileRepository.update(foundProfile.id, {
      ...foundProfile,
      ...profile,
    });
  }

  async deleteProfile(id: number) {
    await this.profileRepository.update(id, { isDelete: true });
  }

  async judgeHuntJob(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: {
        isDelete: false,
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        address: true,
        phone: true,
        maxSalary: true,
        minSalary: true,
        occupation: true,
        resume: true,
        summary: true,
      },
    });

    if (Object.values(profile).every((item) => !!item)) {
      return {
        status: true,
        message: '已填写完整',
      };
    } else {
      const message = Object.entries(profile)
        .filter(([, value]) => !value)
        .map((item) => {
          if (item[0] === 'occupation') {
            return '职位信息';
          }

          if (item[0] === 'phone') {
            return '联系信息';
          }

          if (item[0] === 'minSalary') {
            return '期望薪资';
          }

          if (item[0] === 'summary') {
            return '个人总结';
          }

          if (item[0] === 'resume') {
            return '附件简历';
          }
        })
        .filter((item) => !!item)
        .join('、');

      return {
        status: false,
        message: `请先完善${message}`,
      };
    }
  }
}
