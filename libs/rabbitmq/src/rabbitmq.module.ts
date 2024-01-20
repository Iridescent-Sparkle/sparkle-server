import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    RabbitmqService,
    {
      provide: 'RABBITMQ_CLIENT',
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        const connect = await amqp.connect(
          `amqp://${configService.get('rabbitmq_host')}:${configService.get(
            'rabbitmq_port',
          )}`,
        );
        const channel = await connect.createChannel();
        return channel;
      },
    },
  ],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
