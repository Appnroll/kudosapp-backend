import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';


console.log(`${process.env.DB_HOST} - ${process.env.DB_USERNAME} - ${process.env.DB_NAME} `);
console.log(`PORT: ${process.env.PORT} `);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  const options = new DocumentBuilder()
    .setTitle('KudosApp - API')
    .setDescription('The Kudos app API description')
    .setVersion('1.0')
    .setSchemes('https')
    .addTag('slack')
    .addTag('kudos')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
