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
  name: 'experience',
  comment: '工作经历表',
})
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((experience: Experience) => experience.user)
  @Column()
  userId: number;

  @Column({
    comment: '职位',
  })
  profession: string;

  @Column({
    comment: '公司',
  })
  companyName: string;

  @Column({
    comment: '开始时间',
  })
  startTime: Date;

  @Column({
    comment: '结束时间',
  })
  endTime: Date;

  @Column({
    comment: '是否在职',
  })
  isWork: boolean;

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
