import { Module } from '@nestjs/common';
import { EtcdService } from './etcd.service';

@Module({
  providers: [EtcdService],
  exports: [EtcdService],
})
export class EtcdModule {}
