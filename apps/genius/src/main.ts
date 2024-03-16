import { NestFactory } from '@nestjs/core';
import { GeniusModule } from './genius.module';

async function bootstrap() {
  const app = await NestFactory.create(GeniusModule);
  await app.listen(3000);
}
bootstrap();
