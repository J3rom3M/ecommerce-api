import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // dotenv.config(); ⬅️ Charge `.env` dès le début
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

console.log('Variables d\'environnement chargées:', process.env);

async function bootstrap() {
  console.log('Vérification JWT_SECRET après dotenv:', process.env.JWT_SECRET); // 🔍 Ajout de log
  const app = await NestFactory.create(AppModule);
  app.useLogger(new Logger());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();