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
import { Profile } from './profile.entity';

@Entity({
  name: 'project',
  comment: '项目经历表',
})
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((project: Project) => project.user)
  @Column()
  userId: number;

  @ManyToOne(() => Profile)
  profile: Profile;

  @RelationId((project: Project) => project.profile)
  @Column()
  profileId: number;

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
    default: '',
  })
  website: string;

  @Column({
    comment: '经历描述',
    default: '',
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
