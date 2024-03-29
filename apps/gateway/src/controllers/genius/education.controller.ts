import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Education } from 'apps/genius/src/entities/education.entity';
import { firstValueFrom } from 'rxjs';

@Controller('genius/education')
export class EducationController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user/:userId')
  async findEducationByUserId(@Param('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findEducationByUserId', userId),
    );
  }

  @Post('create')
  async createEducation(@Body() education: Education) {
    return firstValueFrom(this.GeniusClient.send('createEducation', education));
  }

  @Put('update')
  async updateEducation(@Body() education: Education) {
    return firstValueFrom(this.GeniusClient.send('updateEducation', education));
  }

  @Delete('remove')
  async deleteEducation(@Body() education: Education) {
    return firstValueFrom(this.GeniusClient.send('deleteEducation', education));
  }
}
