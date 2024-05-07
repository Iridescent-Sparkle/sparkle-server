import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TradeControl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '端',
  })
  channel: string;

  @Column({
    comment: '是否限制',
    default: false,
  })
  isLimit: boolean;

  @Column({
    comment: '起始版本',
  })
  startVersion: string;

  @Column({
    comment: '终止版本',
  })
  endVersion: string;
}
