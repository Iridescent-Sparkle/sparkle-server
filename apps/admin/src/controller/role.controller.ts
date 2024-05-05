import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Role } from '../entities/role.entity';
import { RoleService } from '../service/role.service';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern('createRole')
  async createRole(createRoleDto: Role) {
    return await this.roleService.createRole(createRoleDto);
  }

  @MessagePattern('getRoleById')
  async getRoleById(id: number) {
    return await this.roleService.getRoleById(id);
  }

  @MessagePattern('findAllRole')
  async findAllRole(params: Role & Pagination) {
    return await this.roleService.findAllRole(params);
  }

  @MessagePattern('updateRole')
  async updateRole(params: Role) {
    return await this.roleService.updateRole(params);
  }

  @MessagePattern('deleteRole')
  async deleteRole(id: number) {
    return await this.roleService.deleteRole(id);
  }
}
