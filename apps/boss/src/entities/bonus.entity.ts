import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'job_bonus',
})
export class JobBonus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '福利名称',
  })
  bonusName: string;

  @Column({
    length: 50,
    comment: '福利描述',
    default: '',
  })
  bonusDescription: string;

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
