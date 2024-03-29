import { Body, Controller, Delete, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('genius/favorite')
export class FavoriteController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findFavoritesByUserId(@UserInfo('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findFavoritesByUserId', userId),
    );
  }

  @Post('create')
  @RequireLogin()
  async addJobToCollection(
    @UserInfo('userId') userId: number,
    @Body() jobData: { jobId: number },
  ) {
    return firstValueFrom(
      this.GeniusClient.send('addJobToCollection', {
        userId,
        jobId: jobData.jobId,
      }),
    );
  }

  @Delete('remove')
  @RequireLogin()
  async removeJobFromCollection(@Body() jobData: { favoriteId: number }) {
    return firstValueFrom(
      this.GeniusClient.send('removeJobFromCollection', {
        favoriteId: jobData.favoriteId,
      }),
    );
  }
}
