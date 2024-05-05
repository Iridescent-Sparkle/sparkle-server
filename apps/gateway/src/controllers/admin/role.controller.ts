import { Body, Controller, Inject, Post } from '@nestjs/common';
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
  async createRole(@Body() createRoleDto: Role) {
    return firstValueFrom(this.adminClient.send('createRole', createRoleDto));
  }

  @Post('get')
  async getRoleById(@Body() { id }: { id: number }) {
    return firstValueFrom(this.adminClient.send('getRoleById', id));
  }

  @Post('all')
  async findAllRole(@Body() params: Role & Pagination) {
    return firstValueFrom(this.adminClient.send('findAllRole', params));
  }

  @Post('update')
  async updateRole(@Body() params: Role) {
    return firstValueFrom(this.adminClient.send('updateRole', params));
  }

  @Post('delete')
  async deleteRole(@Body() { id }: { id: number }) {
    return firstValueFrom(this.adminClient.send('deleteRole', id));
  }
}
