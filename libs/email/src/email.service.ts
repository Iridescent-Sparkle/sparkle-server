import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  @Inject('EMAIL_SERVICE')
  private transporter: Transporter;

  async sendMail({ to, subject, html }) {
    try {
      await this.transporter.sendMail({
        from: {
          name: 'sparkle',
          address: '2389504513@qq.com',
        },
        to,
        subject,
        html,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
