import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Profile } from '../entities/profile.entity';
import { ProfileService } from '../service/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('findAllProfile')
  async findAllProfile(params: Profile & Pagination) {
    return this.profileService.findAllProfile(params);
  }

  @MessagePattern('findProfileByUser')
  async findProfileByUser(userId: number) {
    return this.profileService.findProfileByUser(userId);
  }

  @MessagePattern('createProfile')
  async createProfile(profile: Profile) {
    return this.profileService.createProfile(profile);
  }

  @MessagePattern('updateProfile')
  async updateProfile(profileData: {
    userId: number;
    profile: Profile & { nickname: string; avatar: string };
  }) {
    return this.profileService.updateProfile(profileData);
  }

  @MessagePattern('deleteProfile')
  async deleteProfile(profile: Profile) {
    return this.profileService.deleteProfile(profile.id);
  }

  @MessagePattern('judgeHuntJob')
  async judgeHuntJob(userId: number) {
    return this.profileService.judgeHuntJob(userId);
  }
}
