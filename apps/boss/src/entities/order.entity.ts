import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
    comment: '通知时间',
    type: 'datetime',
  })
  notify_time: Date;

  @Column({
    nullable: true,
    comment: '通知类型，固定trade_status_sync',
  })
  notify_type: string;

  @Column({
    nullable: true,
    comment: '通知校验ID',
  })
  notify_id: string;

  @Column({
    nullable: true,
    comment: '签名类型',
  })
  sign_type: string;

  @Column({
    nullable: true,
    type: 'longtext',
    comment: '签名',
  })
  sign: string;

  @Column({
    nullable: true,
    comment: '支付宝交易号',
  })
  trade_no: string;

  @Column({
    nullable: true,
    comment: '开发者的 app_id',
  })
  app_id: string;

  @Column({
    nullable: true,
    comment: '授权方的 app_id',
  })
  auth_app_id: string;

  @Column({
    nullable: true,
    comment: '商户订单号',
  })
  out_trade_no: string;

  @Column({
    nullable: true,
    comment: '商户业务号',
  })
  out_biz_no: string;

  @Column({ nullable: true, comment: '买家支付宝用户号' })
  buyer_id: string;

  @Column({ nullable: true, comment: '买家支付宝账号' })
  buyer_logon_id: string;

  @Column({ nullable: true, comment: '卖家支付宝用户号' })
  seller_id: string;

  @Column({ nullable: true, comment: '卖家支付宝账号' })
  seller_email: string;

  @Column({ nullable: true, comment: '交易状态' })
  trade_status: string;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 11,
    scale: 2,
    comment: '订单金额',
  })
  total_amount: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 11,
    scale: 2,
    comment: '实收金额',
  })
  receipt_amount: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    nullable: true,
    comment: '开票金额',
  })
  invoice_amount: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    nullable: true,
    comment: '付款金额',
  })
  buyer_pay_amount: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    nullable: true,
    comment: '集分宝金额',
  })
  point_amount: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    nullable: true,
    comment: '总退款金额',
  })
  refund_fee: number;

  @Column({
    type: 'decimal',
    precision: 11,
    scale: 2,
    nullable: true,
    comment: '实际退款金额',
  })
  send_back_fee: number;

  @Column({ nullable: true, comment: '订单标题' })
  subject: string;

  @Column({ nullable: true, comment: '商品描述' })
  body: string;

  @Column({ nullable: true, comment: '商户传入业务信息' })
  passback_params: string;

  @Column({ type: 'datetime', nullable: true, comment: '交易创建时间' })
  gmt_create: Date;

  @Column({ type: 'datetime', nullable: true, comment: '交易付款时间' })
  gmt_payment: Date;

  @Column({ type: 'datetime', nullable: true, comment: '交易退款时间' })
  gmt_refund: Date;

  @Column({ type: 'datetime', nullable: true, comment: '交易结束时间' })
  gmt_close: Date;

  @Column({ nullable: true, comment: '支付金额信息' })
  fund_bill_list: string;

  @Column({ nullable: true, comment: '优惠券信息' })
  voucher_detail_list: string;
}
