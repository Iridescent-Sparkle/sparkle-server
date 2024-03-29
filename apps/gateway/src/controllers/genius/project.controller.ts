import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Project } from 'apps/genius/src/entities/project.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('project')
export class ProjectController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findProject(@UserInfo('userId') userId: number) {
    return firstValueFrom(this.GeniusClient.send('findProject', userId));
  }

  @Post('create')
  @RequireLogin()
  async createProject(@Body() project: Project) {
    return firstValueFrom(this.GeniusClient.send('createProject', project));
  }

  @Post('update')
  @RequireLogin()
  async updateProject(@Body() project: Project) {
    return firstValueFrom(this.GeniusClient.send('updateProject', project));
  }

  @Post('remove')
  @RequireLogin()
  async deleteProject(@Body() project: Project) {
    return firstValueFrom(this.GeniusClient.send('deleteProject', project));
  }
}
