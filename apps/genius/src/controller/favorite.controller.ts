import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FavoriteService } from '../service/favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @MessagePattern('findFavoritesByUserId')
  async findFavoritesByUserId(userId: number) {
    return this.favoriteService.findFavoritesByUserId(userId);
  }

  @MessagePattern('addJobToCollection')
  async addJobToCollection(jobData: { userId: number; jobId: number }) {
    return this.favoriteService.addJobToCollection(jobData);
  }

  @MessagePattern('removeJobFromCollection')
  async removeJobFromCollection(jobData: { favoriteId: number }) {
    return this.favoriteService.removeJobFromCollection(jobData);
  }
}
