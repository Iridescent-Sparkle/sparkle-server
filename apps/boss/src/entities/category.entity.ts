import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_category',
})
export class JobCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '职位类型',
  })
  categoryName: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
