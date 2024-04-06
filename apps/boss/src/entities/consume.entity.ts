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
  name: 'integral_record',
})
export class IntegralRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @RelationId((integralRecord: IntegralRecord) => integralRecord.user)
  @Column()
  userId: number;

  @Column({
    comment: '积分变化数量',
  })
  integral: number;

  @Column({
    comment: '积分记录类型',
  })
  type: string;

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
