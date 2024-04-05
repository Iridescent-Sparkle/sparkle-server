import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  notify_time: Date;

  @Column()
  notify_type: string;

  @Column()
  notify_id: string;

  @Column()
  sign_type: string;

  @Column()
  sign: string;

  @Column()
  trade_no: string;

  @Column()
  app_id: string;

  @Column()
  auth_app_id: string;

  @Column()
  out_trade_no: string;

  @Column({ nullable: true })
  out_biz_no: string;

  @Column({ nullable: true })
  buyer_id: string;

  @Column({ nullable: true })
  buyer_logon_id: string;

  @Column({ nullable: true })
  seller_id: string;

  @Column({ nullable: true })
  seller_email: string;

  @Column()
  trade_status: string;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 11, scale: 2 })
  receipt_amount: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true })
  invoice_amount: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true })
  buyer_pay_amount: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true })
  point_amount: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true })
  refund_fee: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true })
  send_back_fee: number;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  body: string;

  @Column({ nullable: true })
  passback_params: string;

  @Column({ type: 'datetime', nullable: true })
  gmt_create: Date;

  @Column({ type: 'datetime', nullable: true })
  gmt_payment: Date;

  @Column({ type: 'datetime', nullable: true })
  gmt_refund: Date;

  @Column({ type: 'datetime', nullable: true })
  gmt_close: Date;

  @Column({ nullable: true })
  fund_bill_list: string;

  @Column({ nullable: true })
  voucher_detail_list: string;
}
