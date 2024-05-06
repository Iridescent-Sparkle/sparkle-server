import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { User } from 'apps/user/src/entities/user.entity';
import { CustomUserService } from '../service/user.service';
@Controller()
export class CustomUserController {
  constructor(private readonly customUserService: CustomUserService) {}

  /** 获取用户信息 */
  @MessagePattern('findAllCustomUser')
  async findAllCustomUser(params: User & Pagination) {
    return await this.customUserService.findAllCustomUser(params);
  }

  /** 更新用户信息 */
  @MessagePattern('updateCustomUser')
  async updateCustomUser(user: User) {
    return await this.customUserService.updateCustomUser(user);
  }
}
