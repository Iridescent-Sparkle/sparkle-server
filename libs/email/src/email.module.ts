import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Global()
@Module({
  providers: [
    EmailService,
    {
      provide: 'EMAIL_SERVICE',
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const transporter = createTransport({
          host: configService.get('nodemailer_host'),
          port: configService.get('nodemailer_port'),
          auth: {
            user: configService.get('nodemailer_auth_user'),
            pass: configService.get('nodemailer_auth_pass'),
          },
        });
        return transporter;
      },
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
