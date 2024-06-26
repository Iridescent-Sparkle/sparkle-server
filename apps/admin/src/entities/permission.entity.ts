import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'admin_permissions',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '权限代码',
  })
  code: string;

  @Column({
    length: 100,
    comment: '权限描述',
  })
  description: string;

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
