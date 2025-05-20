import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Преобразует входящие данные в классы
      whitelist: true, // Удаляет поля, не указанные в DTO
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Преобразование ответов
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(console.error);
