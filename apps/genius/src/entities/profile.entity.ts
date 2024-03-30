import { User } from 'apps/user/src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'profile',
  comment: '个人信息表',
})
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({
    comment: '职业',
  })
  occupation: string;

  @Column({
    comment: '地址',
  })
  address: string;

  @Column({
    comment: '电话',
  })
  phone: string;

  @Column({
    comment: '邮箱',
  })
  email: string;

  @Column({
    comment: '最小期望薪资',
  })
  minSalary: string;

  @Column({
    comment: '最大期望薪资',
  })
  maxSalary: string;

  @Column({
    comment: '个人总结',
  })
  summary: string;

  @Column({
    comment: '简历pdf',
  })
  resume: string;

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
