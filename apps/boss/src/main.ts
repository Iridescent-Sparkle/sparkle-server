import { NestFactory } from '@nestjs/core';
import { BossModule } from './boss.module';

async function bootstrap() {
  const app = await NestFactory.create(BossModule);
  await app.listen(3000);
}
bootstrap();
