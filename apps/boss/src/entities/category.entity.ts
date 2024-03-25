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

  @Column({
    length: 50,
    comment: '职位描述',
  })
  categoryDescription: string;

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
