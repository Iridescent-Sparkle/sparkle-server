import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { User } from 'apps/user/src/entities/user.entity';

@Injectable()
export class ProfileService {
  @InjectRepository(Profile)
  private profileRepository: Repository<Profile>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor() {}

  async findProfile(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: {
        isDelete: false,
        id: userId,
      },
      relations: ['user'],
    });
    const res = {
      nickName: profile.user.nickName,
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
    profile: Profile & { nickName: string; avatar: string };
  }) {
    if (profile.nickName || profile.avatar) {
      await this.userRepository.update(userId, {
        nickName: profile.nickName,
        avatar: profile.avatar,
      });
    }

    return await this.profileRepository.update(profile.id, profile);
  }

  async deleteProfile(id: number) {
    await this.profileRepository.update(id, { isDelete: true });
  }
}
