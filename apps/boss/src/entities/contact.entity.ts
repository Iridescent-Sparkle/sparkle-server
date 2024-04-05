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
import { JobDetail } from './job.entity';

@Entity({
  name: 'contact_list',
})
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JobDetail)
  job: JobDetail;

  @RelationId((contact: Contact) => contact.job)
  @Column()
  jobId: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((contact: Contact) => contact.user)
  @Column()
  userId: number;

  @Column({
    default: false,
    comment: '是否禁用',
  })
  isFrozen: boolean;

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
