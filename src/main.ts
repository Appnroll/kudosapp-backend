import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


console.log(`${process.env.DB_HOST} - ${process.env.DB_USERNAME} - ${process.env.DB_NAME} `);
console.log(`PORT: ${process.env.PORT} `);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
