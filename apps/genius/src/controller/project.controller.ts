import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Project } from '../entities/project.entity';
import { ProjectService } from '../service/project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern('findProjectByUserId')
  async findProjectByUserId(userId: number) {
    return this.projectService.findProjectByUserId(userId);
  }

  @MessagePattern('findProjectById')
  async findProjectById(id: number) {
    return this.projectService.findProjectById(id);
  }

  @MessagePattern('createProject')
  async createProject(project: Project) {
    return this.projectService.createProject(project);
  }

  @MessagePattern('updateProject')
  async updateProject(project: Project) {
    return this.projectService.updateProject(project);
  }

  @MessagePattern('deleteProject')
  async deleteProject(project: Project) {
    return this.projectService.deleteProject(project.id);
  }
}
