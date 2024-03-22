import { User } from 'apps/user/src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'education',
  comment: '教育经历表',
})
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    comment: '昵称',
  })
  school: string;

  @Column({
    comment: '专业',
  })
  profession: string;

  @Column({
    comment: '入学时间',
  })
  startTime: Date;

  @Column({
    comment: '毕业时间',
  })
  endTime: Date;

  @Column({
    comment: '是否毕业',
  })
  graduate: boolean;

  @Column({
    comment: '绩点',
  })
  gpa: number;

  @Column({
    comment: '满绩点',
  })
  totalGpa: number;

  @Column({
    comment: '经历描述',
  })
  description: string;

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
