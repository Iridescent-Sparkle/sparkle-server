import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Profile } from '../entities/profile.entity';
import { ProfileService } from '../service/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('findProfile')
  async findProfile(userId: number) {
    return this.profileService.findProfile(userId);
  }

  @MessagePattern('createProfile')
  async createProfile(profile: Profile) {
    return this.profileService.createProfile(profile);
  }

  @MessagePattern('updateProfile')
  async updateProfile(profileData: {
    userId: number;
    profile: Profile & { nickName: string; avatar: string };
  }) {
    return this.profileService.updateProfile(profileData);
  }

  @MessagePattern('deleteProfile')
  async deleteProfile(profile: Profile) {
    return this.profileService.deleteProfile(profile.id);
  }
}
