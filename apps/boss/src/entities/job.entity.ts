import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobCategory } from './category.entity';
import { User } from 'apps/user/src/entities/user.entity';

@Entity({
  name: 'job_detail',
})
export class JobDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    length: 50,
    comment: '职位名称',
  })
  jobName: string;

  @Column({
    length: 50,
    comment: '公司名称',
  })
  companyName: string;

  @Column({
    length: 50,
    comment: '公司头像',
  })
  companyAvatar: string;

  @Column({
    length: 50,
    comment: '地址',
  })
  address: string;

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
    comment: '是否全职',
  })
  isFullTime: boolean;

  @Column({
    comment: '是否线上工作',
  })
  isOnsite: boolean;

  @Column({
    type: 'json',
    comment: '工作描述',
  })
  jobDescription: string[];

  @Column({
    type: 'json',
    comment: '工作要求',
  })
  jobRequirements: string[];

  @Column({
    type: 'json',
    comment: '福利',
  })
  jobBonus: string[];

  @Column({
    comment: '工作经验',
  })
  workExperience: string;

  @Column({
    comment: '学历要求',
  })
  educationRequirement: string;

  @Column({
    comment: '职级',
  })
  jobLevel: string;

  @ManyToOne(() => JobCategory)
  jobCategory: JobCategory;

  @Column({
    comment: '空缺',
  })
  headCount: number;

  @Column({
    comment: '网站',
  })
  website: string;

  @Column({
    comment: '网站',
  })
  companyDescription: string;

  @Column({
    default: false,
    comment: '是否冻结',
  })
  isFrozen: boolean;

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
