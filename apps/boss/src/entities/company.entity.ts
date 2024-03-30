import { User } from 'apps/user/src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'company',
  comment: '企业信息表',
})
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user: User) => user.id)
  user: User[];

  @Column({
    comment: '职业',
  })
  companyName: string;

  @Column({
    comment: '地址',
  })
  companyAvatar: string;

  @Column({
    comment: '电话',
  })
  companyDesc: string;

  @Column({
    default: false,
    comment: '是否删除',
  })
  isDelete: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
