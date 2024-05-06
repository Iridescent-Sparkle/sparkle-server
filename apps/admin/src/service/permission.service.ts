import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createPermission(permissionData: Permission): Promise<Permission> {
    return this.permissionRepository.save(permissionData);
  }

  async findAllPermission(params: Permission & Pagination) {
    const { page = 1, pageSize = 10, ...rest } = params;

    const condition: Record<string, any> = {
      id: rest.id,
    };

    if (rest.description) {
      condition.description = Like(`%${rest.description}%`);
    }

    if (rest.code) {
      condition.code = Like(`%${rest.code}%`);
    }

    if (rest.createTime) {
      condition.createTime = Between(
        new Date(rest.createTime[0]),
        new Date(rest.createTime[1]),
      );
    }

    if (rest.updateTime) {
      condition.updateTime = Between(
        new Date(rest.updateTime[0]),
        new Date(rest.updateTime[1]),
      );
    }

    const [data, total] = await this.permissionRepository.findAndCount({
      where: condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async getPermissionById(id: number): Promise<Permission> {
    return this.permissionRepository.findOneBy({
      id,
    });
  }

  async updatePermission(params: Permission): Promise<Permission> {
    await this.permissionRepository.update(params.id, params);
    return this.getPermissionById(params.id);
  }

  async deletePermission(id: number) {
    return await this.permissionRepository.delete(id);
  }
}
