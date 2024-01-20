import { Inject, Injectable } from '@nestjs/common';
import { Channel } from 'amqplib';

@Injectable()
export class RabbitmqService {
  @Inject('RABBITMQ_CLIENT')
  private channel: Channel;

  async publish(queue: string, params: any) {
    await this.channel.assertQueue(queue);
    await this.channel.sendToQueue(queue, params);
  }

  async subscribe(
    queue: string,
    callback: (params?: any) => any,
    noAck: boolean = true,
  ) {
    const { queue: assertQueue } = await this.channel.assertQueue(queue);

    this.channel.consume(
      assertQueue,
      (message) => {
        callback && callback(message);
      },
      { noAck },
    );
  }
}
