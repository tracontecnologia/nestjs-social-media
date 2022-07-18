import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { PhotosModule } from './app/photos/photos.module';
import { PostsModule } from './app/posts/posts.module';
import { UsersModule } from './app/users/users.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useStaticAssets(join(__dirname, '..', 'client'), { prefix: '/public' });

  const config = new DocumentBuilder()
    .setTitle('Social Media API')
    .setDescription('Essa é a API oficila do Social Media')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const userConfig = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('Essa é a API dos usuários')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const userDocument = SwaggerModule.createDocument(app, userConfig, {
    include: [UsersModule],
  });
  SwaggerModule.setup('swagger/user', app, userDocument);

  const postConfig = new DocumentBuilder()
    .setTitle('Post API')
    .setDescription('Essa é a API dos posts')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const postDocument = SwaggerModule.createDocument(app, postConfig, {
    include: [PostsModule],
  });
  SwaggerModule.setup('swagger/posts', app, postDocument);

  const photoConfig = new DocumentBuilder()
    .setTitle('Photo API')
    .setDescription('Essa é a API das fotos')
    .setVersion('0.0.1')
    .build();
  const photoDocument = SwaggerModule.createDocument(app, photoConfig, {
    include: [PhotosModule],
  });
  SwaggerModule.setup('swagger/photos', app, photoDocument);

  await app.listen(3333);
}
bootstrap();
