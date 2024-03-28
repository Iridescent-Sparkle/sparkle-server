import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_education',
})
export class JobEducation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '学历名称',
  })
  educationName: string;

  @Column({
    length: 50,
    comment: '学历描述',
    default: '',
  })
  educationDescription: string;

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
