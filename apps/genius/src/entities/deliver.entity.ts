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
  name: 'job_deliver',
})
export class JobDeliver {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobDetail)
  job: JobDetail;

  @RelationId((jobDeliver: JobDeliver) => jobDeliver.job)
  @Column()
  jobId: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((jobDeliver: JobDeliver) => jobDeliver.user)
  @Column()
  userId: number;

  @Column({
    comment: '投递状态',
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
