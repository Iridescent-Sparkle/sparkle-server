import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_collect',
})
export class JobCollect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '职位id',
  })
  jobId: number;

  @Column({
    comment: '用户id',
  })
  userId: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
