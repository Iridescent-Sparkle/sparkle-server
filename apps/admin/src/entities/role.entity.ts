import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
  name: 'admin_roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '角色名',
  })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'admin_role_permissions',
  })
  permissions: Permission[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({
    default: false,
    comment: '是否冻结',
  })
  isFrozen: boolean;
}
