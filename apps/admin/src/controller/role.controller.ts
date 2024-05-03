import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Role } from '../entities/role.entity';
import { RoleService } from '../service/role.service';

@Controller('roles')
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

  @MessagePattern('updateRole')
  async updateRole({ id, updateRoleDto }: { id: number; updateRoleDto: Role }) {
    return await this.roleService.updateRole(id, updateRoleDto);
  }

  @MessagePattern('deleteRole')
  async deleteRole(id: number) {
    return await this.roleService.deleteRole(id);
  }
}
