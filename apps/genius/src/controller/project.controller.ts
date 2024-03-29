import { Body, Controller, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../service/project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern('findProject')
  async findProject(@Param('userId') userId: number) {
    return this.projectService.findProject(userId);
  }

  @MessagePattern('createProject')
  async createProject(@Body() project: Project) {
    return this.projectService.createProject(project);
  }

  @MessagePattern('updateProject')
  async updateProject(@Body() project: Project) {
    return this.projectService.updateProject(project);
  }

  @MessagePattern('deleteProject')
  async deleteProject(@Body() project: Project) {
    return this.projectService.deleteProject(project.id);
  }
}
