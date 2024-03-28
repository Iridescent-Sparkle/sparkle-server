/*
 * @Date: 2024-01-11 12:54:59
 * @Description: User表
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称',
  })
  nickName: string;

  @Column({
    length: 50,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    length: 50,
    default: '',
    comment: '邮箱',
  })
  email: string;

  @Column({
    length: 50,
    comment: '联系ID老板',
    nullable: true,
  })
  contactIdToB: string;

  @Column({
    length: 50,
    comment: '联系ID牛人',
    nullable: true,
  })
  contactIdToC: string;

  @Column({
    length: 50,
    comment: '联系密码',
    nullable: true,
  })
  contactPassword: string;

  @Column({
    default: false,
    comment: '是否冻结',
  })
  isFrozen: boolean;

  @Column({
    default: false,
    comment: '是否是管理员',
  })
  isAdmin: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
