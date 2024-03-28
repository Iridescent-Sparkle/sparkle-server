import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_level',
})
export class JobLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '职级名称',
  })
  levelName: string;

  @Column({
    length: 50,
    comment: '职级描述',
    default: '',
  })
  levelDescription: string;

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
