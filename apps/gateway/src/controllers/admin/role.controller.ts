import { Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Role } from './../../../../admin/src/entities/role.entity';

@Controller({
  path: 'admin/role',
})
export class RoleController {
  @Inject('ADMIN_SERVICE')
  private adminClient: ClientProxy;

  @Post('create')
  async createRole(createRoleDto: Role) {
    return firstValueFrom(this.adminClient.send('createRole', createRoleDto));
  }

  @Post('get')
  async getRoleById(id: number) {
    return firstValueFrom(this.adminClient.send('getRoleById', id));
  }

  @Post('update')
  async updateRole({ id, updateRoleDto }: { id: number; updateRoleDto: Role }) {
    return firstValueFrom(
      this.adminClient.send('updateRole', { id, updateRoleDto }),
    );
  }

  @Post('delete')
  async deleteRole(id: number) {
    return firstValueFrom(this.adminClient.send('deleteRole', id));
  }
}
