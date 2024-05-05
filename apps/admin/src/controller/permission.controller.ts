import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Permission } from '../entities/permission.entity';
import { PermissionService } from '../service/permission.service';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @MessagePattern('createPermission')
  async createPermission(createPermissionDto: Permission) {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  @MessagePattern('getPermissionById')
  async getPermissionById(id: number) {
    return await this.permissionService.getPermissionById(id);
  }

  @MessagePattern('findAllPermission')
  async findAllPermission(params: Permission & Pagination) {
    return await this.permissionService.findAllPermission(params);
  }

  @MessagePattern('updatePermission')
  async updatePermission({
    id,
    updatePermissionDto,
  }: {
    id: number;
    updatePermissionDto: Permission;
  }) {
    return await this.permissionService.updatePermission(
      id,
      updatePermissionDto,
    );
  }

  @MessagePattern('deletePermission')
  async deletePermission(id: number) {
    return await this.permissionService.deletePermission(id);
  }
}
