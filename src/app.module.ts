import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/users/users.module';
import { PostsModule } from './app/posts/posts.module';
import { PhotosModule } from './app/photos/photos.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './app/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' }),
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: false,
      logging: false,
      keepConnectionAlive: process.env.NODE_ENV === 'test',
    }),
    UsersModule,
    PostsModule,
    PhotosModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
