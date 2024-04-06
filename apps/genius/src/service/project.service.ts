import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectService {
  @InjectRepository(Project)
  private projectRepository: Repository<Project>;

  constructor() {}

  async findProjectByUserId(userId: number) {
    return await this.projectRepository.find({
      where: {
        isDelete: false,
        user: {
          id: userId,
        },
      },
    });
  }

  async findProjectById(id: number) {
    return await this.projectRepository.findOne({
      where: {
        id,
        isDelete: false,
      },
    });
  }

  async createProject(project: Project): Promise<Project> {
    project.profileId = project.userId;
    return await this.projectRepository.save(project);
  }

  async updateProject(project: Project): Promise<any> {
    return await this.projectRepository.update(project.id, project);
  }

  async deleteProject(id: number): Promise<void> {
    await this.projectRepository.update(id, { isDelete: true });
  }
}
