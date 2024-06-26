import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import AlipaySdk from 'alipay-sdk';
import { generateAlipayOrderNumber } from './utils';

@Injectable()
export class AlipayService {
  @Inject('ALIPAY_SERVICE')
  private readonly alipaySdk: AlipaySdk;

  async createOrder(params: {
    totalAmount: number;
    subject: string;
    body: string;
    passback_params: Record<string, any>;
  }) {
    try {
      return await this.alipaySdk.sdkExec('alipay.trade.app.pay', {
        notify_url:
          process.env.NODE_ENV === 'production'
            ? 'https://iridescent.icu/boss/order/receive'
            : 'http://6p55126c83.zicp.fun/boss/order/receive',
        bizContent: {
          out_trade_no: generateAlipayOrderNumber(),
          ...params,
        },
      });
    } catch (error) {
      throw new RpcException({
        message: JSON.stringify(error),
        code: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async refundOrder(params: {
    refund_amount: number;
    trade_no: number;
    refund_reason: string;
  }) {
    try {
      return await this.alipaySdk.exec('alipay.trade.refund', {
        bizContent: params,
      });
    } catch (error) {
      throw new RpcException({
        message: JSON.stringify(error),
        code: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
