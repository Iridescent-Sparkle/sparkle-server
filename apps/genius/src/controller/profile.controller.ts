import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProfileService } from '../service/profile.service';
import { Profile } from '../entities/profile.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('user/:userId')
  async findProfile(@Param('userId') userId: number) {
    return this.profileService.findProfile(userId);
  }

  @Post('create')
  async createProfile(@Body() profile: Profile) {
    return this.profileService.createProfile(profile);
  }

  @Put('update')
  async updateProfile(@Body() profile: Profile) {
    return this.profileService.updateProfile(profile);
  }

  @Delete('remove')
  async deleteProfile(@Body() profile: Profile) {
    return this.profileService.deleteProfile(profile.id);
  }
}
