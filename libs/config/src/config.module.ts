import { Module } from '@nestjs/common';
import { ConfigModule as NestConfidModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfidModule.forRoot({
      isGlobal: true,
      envFilePath: [`libs/config/src/.${process.env.NODE_ENV}.env`],
    }),
  ],
})
export class ConfigModule {}
