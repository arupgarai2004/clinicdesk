import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

async function bootstrap() {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.enableCors();
  const port = Number(process.env.PORT) || 3333;
  const host = process.env.HOST || '0.0.0.0';
  await app.listen(port, host);
  console.log(`API running on http://${host}:${port}`);
}
bootstrap();
