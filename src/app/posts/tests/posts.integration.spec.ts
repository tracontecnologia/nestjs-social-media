import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { PhotosEntity } from '../../photos/entities/photos.entity';
import { PhotosModule } from '../../photos/photos.module';
import { UserProfilesEntity } from '../../users/entities/user-profiles.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { PostsEntity } from '../entities/posts.entity';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';

describe('PostsIntegration', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.test' }),
        TypeOrmModule.forRoot({
          type: process.env.TYPEORM_CONNECTION as any,
          host: process.env.TYPEORM_HOST,
          port: Number(process.env.TYPEORM_PORT),
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          database: process.env.TYPEORM_DATABASE,
          entities: [PostsEntity, UsersEntity, UserProfilesEntity, PhotosEntity],
          synchronize: false,
          logging: true,
        }),
        TypeOrmModule.forFeature([PostsEntity]),
        PhotosModule,
      ],
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
    expect(postsService).toBeDefined();
  });
});
