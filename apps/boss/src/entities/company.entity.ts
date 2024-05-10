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
  name: 'company_info',
  comment: '企业信息表',
})
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => User, (user: User) => user.id)
  user: User[];

  @Column({
    comment: '公司名称',
  })
  companyName: string;

  @Column({
    comment: '公司地址',
  })
  companyAddress: string;

  @Column({
    comment: '公司头像',
  })
  companyAvatar: string;

  @Column({
    comment: '营业执照',
  })
  companyLicense: string;

  @Column({
    comment: '公司描述',
  })
  companyDesc: string;

  @Column({
    comment: '审核状态',
    default: 0,
  })
  status: number;

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
