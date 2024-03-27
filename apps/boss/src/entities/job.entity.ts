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
    nullable: true,
  })
  jobName: string;

  @Column({
    length: 50,
    comment: '公司名称',
    nullable: true,
  })
  companyName: string;

  @Column({
    length: 50,
    comment: '公司头像',
    nullable: true,
  })
  companyAvatar: string;

  @Column({
    length: 50,
    comment: '地址',
    nullable: true,
  })
  address: string;

  @Column({
    length: 50,
    comment: '最低薪资',
    nullable: true,
  })
  minSalary: string;

  @Column({
    length: 50,
    comment: '最高薪资',
    nullable: true,
  })
  maxSalary: string;

  @Column({
    comment: '是否全职',
    nullable: true,
  })
  isFullTime: boolean;

  @Column({
    comment: '是否线上工作',
    nullable: true,
  })
  isOnsite: boolean;

  @Column({
    type: 'json',
    comment: '工作描述',
    nullable: true,
  })
  jobDescription: string[];

  @Column({
    type: 'json',
    comment: '工作要求',
    nullable: true,
  })
  jobRequirements: string[];

  @Column({
    type: 'json',
    comment: '福利',
    nullable: true,
  })
  jobBonus: string[];

  @Column({
    type: 'json',
    comment: '所需技能',
    nullable: true,
  })
  requireSkills: string[];

  @Column({
    comment: '工作经验',
    nullable: true,
  })
  workExperience: string;

  @Column({
    comment: '学历要求',
    nullable: true,
  })
  educationRequirement: string;

  @Column({
    comment: '职级',
    nullable: true,
  })
  jobLevel: string;

  @ManyToOne(() => JobCategory)
  jobCategory: JobCategory;

  @Column({
    comment: '空缺',
    nullable: true,
  })
  headCount: number;

  @Column({
    comment: '网站',
    nullable: true,
  })
  website: string;

  @Column({
    comment: '关于',
    nullable: true,
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
