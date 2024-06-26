import { User } from 'apps/user/src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { JobBonus } from './bonus.entity';
import { JobCategory } from './category.entity';
import { JobEducation } from './education.entity';
import { JobExperience } from './experience.entity';
import { JobLevel } from './level.entity';
import { JobCollect } from 'apps/genius/src/entities/collect.entity';
import { JobDeliver } from '../../../genius/src/entities/deliver.entity';
import { Company } from './company.entity';

@Entity({
  name: 'job_detail',
})
export class JobDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((jobDetail: JobDetail) => jobDetail.user)
  @Column({})
  userId: number;

  @Column({
    length: 50,
    comment: '职位名称',
    nullable: true,
  })
  jobName: string;

  @ManyToOne(() => Company)
  company: Company;

  @RelationId((jobDetail: JobDetail) => jobDetail.company)
  @Column({})
  companyId: number;

  @Column({
    length: 50,
    comment: '工作地址',
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
    comment: '工作描述',
    nullable: true,
  })
  jobDescription: string;

  @Column({
    comment: '工作要求',
    nullable: true,
  })
  jobRequirements: string;

  @ManyToMany(() => JobBonus)
  @JoinTable({
    name: 'job_detail_bonus',
  })
  jobBonus: JobBonus[];

  @ManyToOne(() => JobExperience)
  jobExperience: JobExperience;

  @RelationId((jobDeatil: JobDetail) => jobDeatil.jobExperience)
  @Column()
  jobExperienceId: number;

  @ManyToOne(() => JobEducation)
  jobEducation: JobEducation;

  @RelationId((jobDeatil: JobDetail) => jobDeatil.jobEducation)
  @Column()
  jobEducationId: number;

  @ManyToOne(() => JobLevel)
  jobLevel: JobLevel;

  @RelationId((jobDeatil: JobDetail) => jobDeatil.jobLevel)
  @Column()
  jobLevelId: number;

  @ManyToOne(() => JobCategory)
  jobCategory: JobCategory;

  @RelationId((jobDeatil: JobDetail) => jobDeatil.jobCategory)
  @Column()
  jobCategoryId: number;

  @OneToMany(() => JobCollect, (jobCollect) => jobCollect.job)
  jobCollect: JobCollect[];

  @OneToMany(() => JobDeliver, (jobDeliver) => jobDeliver.job)
  jobDeliver: JobDeliver[];

  @Column({
    comment: '空缺',
    nullable: true,
  })
  headCount: number;

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
