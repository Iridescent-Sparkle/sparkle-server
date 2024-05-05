import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Like, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createRole(roleData: Role) {
    const role = new Role();
    role.name = roleData.name;
    role.permissions = [];

    for (const permissionId of roleData.permissions) {
      const permission = await this.permissionRepository.findOne({
        where: {
          id: permissionId as unknown as number,
        },
      });

      if (permission) {
        role.permissions.push(permission);
      }
    }

    return this.roleRepository.save(role);
  }

  async findAllRole(params: Role & Pagination) {
    const { page = 1, pageSize = 10, ...rest } = params;

    const condition: Record<string, any> = {
      id: rest.id,
    };

    if (rest.name) {
      condition.name = Like(`%${rest.name}%`);
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

    if (rest.isFrozen !== undefined) {
      condition.isFrozen = rest.isFrozen;
    }

    if (rest.permissions) {
      condition.permissions = {
        id: In(rest.permissions),
      };
    }

    const [data, total] = await this.roleRepository.findAndCount({
      where: condition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: {
        permissions: true,
      },
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async getRoleById(id: number) {
    return this.roleRepository.findOneBy({
      id,
    });
  }

  async updateRole(roleData: Role) {
    const role = await this.getRoleById(roleData.id);
    if (roleData.name) {
      role.name = roleData.name;
    }
    if (roleData.permissions) {
      role.permissions = [];

      for (const permissionId of roleData.permissions) {
        const permission = await this.permissionRepository.findOne({
          where: {
            id: permissionId as unknown as number,
          },
        });

        if (permission) {
          role.permissions.push(permission);
        }
      }
    }
    if (roleData.isFrozen !== undefined) {
      role.isFrozen = roleData.isFrozen;
    }
    return await this.roleRepository.save(role);
  }

  async deleteRole(id: number) {
    await this.roleRepository.delete(id);
    return {
      message: '删除成功',
    };
  }
}
