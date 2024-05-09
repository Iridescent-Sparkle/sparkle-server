import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Permission } from '../../../../admin/src/entities/permission.entity';
import { RequireLogin } from 'decorators/custom.decorator';

@Controller({
  path: 'admin/permission',
})
export class PermissionController {
  @Inject('ADMIN_SERVICE')
  private adminClient: ClientProxy;

  @Post('create')
  @RequireLogin()
  async createPermission(@Body() createPermissionDto: Permission) {
    return firstValueFrom(
      this.adminClient.send('createPermission', createPermissionDto),
    );
  }

  @Post('get')
  @RequireLogin()
  async getPermissionById(@Body() id: number) {
    return firstValueFrom(this.adminClient.send('getPermissionById', id));
  }

  @Post('all')
  @RequireLogin()
  async findAllPermission(@Body() params: Permission & Pagination) {
    return firstValueFrom(this.adminClient.send('findAllPermission', params));
  }

  @Post('update')
  @RequireLogin()
  async updatePermission(
    @Body()
    params: Permission,
  ) {
    return firstValueFrom(this.adminClient.send('updatePermission', params));
  }

  @Post('delete')
  @RequireLogin()
  async deletePermission(@Body() { id }: { id: number }) {
    return firstValueFrom(this.adminClient.send('deletePermission', id));
  }
}
