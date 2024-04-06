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
  name: 'volunteer',
  comment: '志愿者经历表',
})
export class Volunteer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((volunteer: Volunteer) => volunteer.user)
  @Column()
  userId: number;

  @ManyToOne(() => Profile)
  profile: Profile;

  @RelationId((volunteer: Volunteer) => volunteer.profile)
  @Column()
  profileId: number;

  @Column({
    comment: '活动名称',
  })
  activityName: string;

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
