import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


console.log(`${process.env.DB_HOST} - ${process.env.DB_USERNAME} - ${process.env.DB_NAME} `);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
