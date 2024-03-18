import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'resume',
})
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '昵称',
  })
  nickName: string;

  @Column({
    length: 50,
    comment: '职业',
  })
  occupation: string;

  @Column({
    length: 50,
    comment: '头像',
  })
  avatar: string;

  @Column({
    length: 50,
    comment: '电话',
  })
  phone: string;

  @Column({
    length: 50,
    comment: '地址',
  })
  address: string;

  @Column({
    comment: '个人总结',
  })
  summary: string;

  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @Column({
    length: 50,
    comment: '最低薪资',
  })
  minSalary: string;

  @Column({
    length: 50,
    comment: '最高薪资',
  })
  maxSalary: string;

  @Column({
    comment: '技能',
  })
  skill: string[];

  @Column({
    comment: '简历',
  })
  resume: string;

  @Column({
    default: false,
    comment: '是否冻结',
  })
  isFrozen: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
