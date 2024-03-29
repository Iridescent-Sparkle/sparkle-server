import { Body, Controller, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FavoriteService } from '../service/favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @MessagePattern('findFavoritesByUserId')
  async findFavoritesByUserId(@Param('userId') userId: number) {
    return this.favoriteService.findFavoritesByUserId(userId);
  }

  @MessagePattern('addJobToCollection')
  async addJobToCollection(@Body() jobData: any) {
    const { jobId, userId } = jobData;
    return this.favoriteService.addJobToCollection(jobId, userId);
  }

  @MessagePattern('removeJobFromCollection')
  async removeJobFromCollection(@Body() jobData: any) {
    const { jobId, userId } = jobData;
    return this.favoriteService.removeJobFromCollection(jobId, userId);
  }
}
