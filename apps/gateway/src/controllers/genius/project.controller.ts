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
import { Project } from 'apps/genius/src/entities/project.entity';
import { firstValueFrom } from 'rxjs';

@Controller('project')
export class ProjectController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user/:userId')
  async findProject(@Param('userId') userId: number) {
    return firstValueFrom(this.GeniusClient.send('findProject', userId));
  }

  @Post('create')
  async createProject(@Body() project: Project) {
    return firstValueFrom(this.GeniusClient.send('createProject', project));
  }

  @Put('update')
  async updateProject(@Body() project: Project) {
    return firstValueFrom(this.GeniusClient.send('updateProject', project));
  }

  @Delete('remove')
  async deleteProject(@Body() project: Project) {
    return firstValueFrom(this.GeniusClient.send('deleteProject', project));
  }
}
