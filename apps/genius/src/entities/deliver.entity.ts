import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_deliver',
})
export class JobDeliver {
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

  @Column({
    comment: '投递状态',
  })
  status: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
