import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Education } from 'apps/genius/src/entities/education.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('genius/education')
export class EducationController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findEducationByUserId(@UserInfo('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findEducationByUserId', userId),
    );
  }

  @Get('single')
  @RequireLogin()
  async findEducationById(@Query() id: number) {
    return firstValueFrom(this.GeniusClient.send('findEducationById', id));
  }

  @Post('create')
  @RequireLogin()
  async createEducation(
    @UserInfo('userId') userId: number,
    @Body() education: Education,
  ) {
    return firstValueFrom(
      this.GeniusClient.send('createEducation', {
        userId,
        ...education,
      }),
    );
  }

  @Post('update')
  @RequireLogin()
  async updateEducation(@Body() education: Education) {
    return firstValueFrom(this.GeniusClient.send('updateEducation', education));
  }

  @Delete('remove')
  @RequireLogin()
  async deleteEducation(@Body() education: Education) {
    return firstValueFrom(this.GeniusClient.send('deleteEducation', education));
  }
}
