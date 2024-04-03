import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import AlipaySdk from 'alipay-sdk';
import { generateAlipayOrderNumber } from './utils';

@Injectable()
export class AlipayService {
  @Inject('ALIPAY_SERVICE')
  private readonly alipaySdk: AlipaySdk;

  async createOrder(params: { totalAmount: number; subject: string }) {
    try {
      const { totalAmount, subject } = params;
      const result = await this.alipaySdk.sdkExec('alipay.trade.app.pay', {
        notify_url: 'https://api.iridescent.icu/user/pay/',
        bizContent: {
          out_trade_no: generateAlipayOrderNumber(), // 订单号，用于识别订单，不能重复
          total_amount: totalAmount, // 金额
          subject: subject, // 支付商品名称
        },
      });
      return result;
    } catch (error) {
      throw new RpcException({
        message: JSON.stringify(error),
        code: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
