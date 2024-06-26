import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Project } from 'apps/genius/src/entities/project.entity';
import { RequireLogin, UserInfo } from 'decorators/custom.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('genius/project')
export class ProjectController {
  @Inject('GENIUS_SERVICE')
  private GeniusClient: ClientProxy;

  @Get('user')
  @RequireLogin()
  async findProjectByUserId(@UserInfo('userId') userId: number) {
    return firstValueFrom(
      this.GeniusClient.send('findProjectByUserId', userId),
    );
  }

  @Get('single')
  @RequireLogin()
  async findProjectById(@Query() id: number) {
    return firstValueFrom(this.GeniusClient.send('findProjectById', id));
  }

  @Post('create')
  @RequireLogin()
  async createProject(
    @UserInfo('userId') userId: number,
    @Body() project: Project,
  ) {
    return firstValueFrom(
      this.GeniusClient.send('createProject', {
        userId,
        ...project,
      }),
    );
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
