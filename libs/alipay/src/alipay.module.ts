import { Module } from '@nestjs/common';
import { AlipayService } from './alipay.service';
import AlipaySdk from 'alipay-sdk';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    AlipayService,
    {
      inject: [ConfigService],
      provide: 'ALIPAY_SERVICE',
      useFactory(configService: ConfigService) {
        const alipaySdk = new AlipaySdk({
          appId: configService.get('ALIPAY_APP_ID'),
          privateKey:
            process.env.NODE_ENV === 'production'
              ? fs.readFileSync(
                  path.join(__dirname, '../cert/private-key.pem'),
                  'ascii',
                )
              : fs.readFileSync(
                  path.join(__dirname, './cert/private-key.pem'),
                  'ascii',
                ),
          alipayRootCertPath:
            process.env.NODE_ENV === 'production'
              ? path.join(__dirname, '../cert/alipayRootCert.crt')
              : path.join(__dirname, './cert/alipayRootCert.crt'),
          alipayPublicCertPath:
            process.env.NODE_ENV === 'production'
              ? path.join(__dirname, '../cert/alipayPublicCert.crt')
              : path.join(__dirname, './cert/alipayPublicCert.crt'),
          appCertPath:
            process.env.NODE_ENV === 'production'
              ? path.join(__dirname, '../cert/appPublicCert.crt')
              : path.join(__dirname, './cert/appPublicCert.crt'),
          gateway: 'https://openapi-sandbox.dl.alipaydev.com/gateway.do',
        });
        return alipaySdk;
      },
    },
  ],
  exports: [AlipayService],
})
export class AlipayModule {}
