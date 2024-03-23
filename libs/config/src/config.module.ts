import { Module } from '@nestjs/common';
import { ConfigModule as NestConfidModule } from '@nestjs/config';
import { join } from 'node:path';

@Module({
  imports: [
    NestConfidModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV === 'production'
          ? join(__dirname, '.production.env')
          : 'env/.development.env',
        ,
      ],
    }),
  ],
})
export class ConfigModule {}
