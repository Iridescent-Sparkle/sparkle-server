import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('genius/favorite')
export class FavoriteController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user/:userId')
  async findFavoritesByUserId(@Param('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findFavoritesByUserId', userId),
    );
  }

  @Post('create')
  async addJobToCollection(@Body() jobData: any) {
    return firstValueFrom(
      this.GeniusClient.send('addJobToCollection', jobData),
    );
  }

  @Delete('remove')
  async removeJobFromCollection(@Body() jobData: any) {
    return firstValueFrom(
      this.GeniusClient.send('removeJobFromCollection', jobData),
    );
  }
}
