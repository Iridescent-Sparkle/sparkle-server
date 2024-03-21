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
  name: 'project',
})
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    comment: '项目名称',
  })
  projectName: string;

  @Column({
    comment: '承担角色',
  })
  role: string;

  @Column({
    comment: '开始时间',
  })
  startTime: Date;

  @Column({
    comment: '结束时间',
  })
  endTime: Date;

  @Column({
    comment: '项目地址',
  })
  website: number;

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
