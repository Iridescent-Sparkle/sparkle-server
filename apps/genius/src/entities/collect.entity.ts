import { JobDetail } from 'apps/boss/src/entities/job.entity';
import { User } from 'apps/user/src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_collect',
})
export class JobCollect {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobDetail)
  job: JobDetail;

  @RelationId((jobCollect: JobCollect) => jobCollect.job)
  @Column()
  jobId: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((jobCollect: JobCollect) => jobCollect.user)
  @Column()
  userId: number;

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
