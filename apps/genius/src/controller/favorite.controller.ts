import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FavoriteService } from '../service/favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('user/:userId')
  async findFavoritesByUserId(@Param('userId') userId: number) {
    return this.favoriteService.findFavoritesByUserId(userId);
  }

  @Post('create')
  async addJobToCollection(@Body() jobData: any) {
    const { jobId, userId } = jobData;
    return this.favoriteService.addJobToCollection(jobId, userId);
  }

  @Delete('remove')
  async removeJobFromCollection(@Body() jobData: any) {
    const { jobId, userId } = jobData;
    return this.favoriteService.removeJobFromCollection(jobId, userId);
  }
}
