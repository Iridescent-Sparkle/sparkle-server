import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(roleData: Role): Promise<Role> {
    return this.roleRepository.save(roleData);
  }

  async getRoleById(id: number): Promise<Role> {
    return this.roleRepository.findOneBy({
      id,
    });
  }

  async updateRole(id: number, roleData: Role): Promise<Role> {
    await this.roleRepository.update(id, roleData);
    return this.getRoleById(id);
  }

  async deleteRole(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
