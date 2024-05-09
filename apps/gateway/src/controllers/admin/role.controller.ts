import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Role } from './../../../../admin/src/entities/role.entity';
import { RequireLogin } from 'decorators/custom.decorator';

@Controller({
  path: 'admin/role',
})
export class RoleController {
  @Inject('ADMIN_SERVICE')
  private adminClient: ClientProxy;

  @Post('create')
  @RequireLogin()
  async createRole(@Body() createRoleDto: Role) {
    return firstValueFrom(this.adminClient.send('createRole', createRoleDto));
  }

  @Post('get')
  @RequireLogin()
  async getRoleById(@Body() { id }: { id: number }) {
    return firstValueFrom(this.adminClient.send('getRoleById', id));
  }

  @Post('all')
  @RequireLogin()
  async findAllRole(@Body() params: Role & Pagination) {
    return firstValueFrom(this.adminClient.send('findAllRole', params));
  }

  @Post('update')
  @RequireLogin()
  async updateRole(@Body() params: Role) {
    return firstValueFrom(this.adminClient.send('updateRole', params));
  }

  @Post('delete')
  @RequireLogin()
  async deleteRole(@Body() { id }: { id: number }) {
    return firstValueFrom(this.adminClient.send('deleteRole', id));
  }
}
