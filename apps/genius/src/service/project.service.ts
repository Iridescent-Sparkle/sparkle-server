import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectService {
  @InjectRepository(Project)
  private projectRepository: Repository<Project>;

  constructor() {}

  async findProject(userId: number) {
    return await this.projectRepository.find({
      where: {
        isDelete: false,
        user: {
          id: userId,
        },
      },
    });
  }

  async createProject(project: Project): Promise<Project> {
    return await this.projectRepository.save(project);
  }

  async updateProject(project: Project): Promise<any> {
    return await this.projectRepository.update(project.id, project);
  }

  async deleteProject(id: number): Promise<void> {
    await this.projectRepository.update(id, { isDelete: true });
  }
}
