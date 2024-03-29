import { Body, Controller, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Profile } from '../entities/profile.entity';
import { ProfileService } from '../service/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @MessagePattern('findProfile')
  async findProfile(@Param('userId') userId: number) {
    return this.profileService.findProfile(userId);
  }

  @MessagePattern('createProfile')
  async createProfile(@Body() profile: Profile) {
    return this.profileService.createProfile(profile);
  }

  @MessagePattern('updateProfile')
  async updateProfile(@Body() profile: Profile) {
    return this.profileService.updateProfile(profile);
  }

  @MessagePattern('deleteProfile')
  async deleteProfile(@Body() profile: Profile) {
    return this.profileService.deleteProfile(profile.id);
  }
}
