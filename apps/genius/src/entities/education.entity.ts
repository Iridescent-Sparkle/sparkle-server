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
  name: 'genius_education',
  comment: '教育经历表',
})
export class Education {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((education: Education) => education.user)
  @Column()
  userId: number;

  @ManyToOne(() => Profile)
  profile: Profile;

  @RelationId((education: Education) => education.profile)
  @Column()
  profileId: number;

  @Column({
    comment: '学校',
  })
  school: string;

  @Column({
    comment: '专业',
  })
  profession: string;

  @Column({
    comment: '学历',
    default: 1,
  })
  educationLevel: number;

  @Column({
    comment: '入学时间',
  })
  startTime: Date;

  @Column({
    comment: '毕业时间',
  })
  endTime: Date;

  @Column({
    comment: '绩点',
  })
  gpa: string;

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
