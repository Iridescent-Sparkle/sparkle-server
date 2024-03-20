import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { User } from 'apps/user/src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_collect',
})
export class JobCollect {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => JobDetail)
  @JoinColumn()
  job: JobDetail;

  @ManyToOne(() => User)
  user: User;

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
