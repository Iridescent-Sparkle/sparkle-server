import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../service/project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('user/:userId')
  async findProject(@Param('userId') userId: number) {
    return this.projectService.findProject(userId);
  }

  @Post('create')
  async createProject(@Body() project: Project) {
    return this.projectService.createProject(project);
  }

  @Put('update')
  async updateProject(@Body() project: Project) {
    return this.projectService.updateProject(project);
  }

  @Delete('remove')
  async deleteProject(@Body() project: Project) {
    return this.projectService.deleteProject(project.id);
  }
}
