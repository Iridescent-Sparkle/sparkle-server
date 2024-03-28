import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_experience',
})
export class JobExperience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '经验名称',
  })
  experienceName: string;

  @Column({
    length: 50,
    comment: '经验描述',
    default: '',
  })
  experienceDescription: string;

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
