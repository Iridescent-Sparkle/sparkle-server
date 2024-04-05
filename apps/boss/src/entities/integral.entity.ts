import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'integral_meal',
})
export class IntegralMeal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '积分数量',
  })
  integralNum: number;

  @Column({
    comment: '充值金额',
  })
  price: number;

  @Column({
    default: false,
    comment: '是否默认展示',
  })
  isDefault: boolean;

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
