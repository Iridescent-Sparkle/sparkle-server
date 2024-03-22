import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';

@Injectable()
export class ProfileService {
  @InjectRepository(Profile)
  private profileRepository: Repository<Profile>;

  constructor() {}

  async findProfile(userId: number) {
    return await this.profileRepository.find({
      where: {
        isDelete: false,
        user: {
          id: userId,
        },
      },
    });
  }

  async createProfile(profile: Profile): Promise<Profile> {
    return await this.profileRepository.save(profile);
  }

  async updateProfile(profile: Profile): Promise<any> {
    return await this.profileRepository.update(profile.id, profile);
  }

  async deleteProfile(id: number): Promise<void> {
    await this.profileRepository.update(id, { isDelete: true });
  }
}
