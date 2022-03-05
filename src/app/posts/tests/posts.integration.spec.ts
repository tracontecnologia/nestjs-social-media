import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionHelper } from '../../../helpers/tests/connection.helper';
import { PostTestIntegrationHelper } from '../../../helpers/tests/post-test-integration.helper';
import { UserTestIntegrationHelper } from '../../../helpers/tests/user-test-integration.helper';
import { PhotosEntity } from '../../photos/entities/photos.entity';
import { PhotosModule } from '../../photos/photos.module';
import { UserProfilesEntity } from '../../users/entities/user-profiles.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { IndexPostDto } from '../dto/index-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsEntity } from '../entities/posts.entity';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';

describe('PostsIntegration', () => {
  let postsController: PostsController;
  let postsService: PostsService;
  const connectionHelper = new ConnectionHelper();
  let userTestIntegrationHelper: UserTestIntegrationHelper;
  let postTestIntegrationHelper: PostTestIntegrationHelper;

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
          logging: false,
          keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature([PostsEntity]),
        PhotosModule,
      ],
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);

    const entityManager = connectionHelper.getEntityManager();
    userTestIntegrationHelper = new UserTestIntegrationHelper(entityManager);
    postTestIntegrationHelper = new PostTestIntegrationHelper(entityManager);

    await userTestIntegrationHelper.seed();
    const user = await userTestIntegrationHelper.findOne();
    await postTestIntegrationHelper.seed({ userId: user.id });
  });

  afterEach(async () => {
    const entityManager = connectionHelper.getEntityManager();
    userTestIntegrationHelper = new UserTestIntegrationHelper(entityManager);
    postTestIntegrationHelper = new PostTestIntegrationHelper(entityManager);

    await postTestIntegrationHelper.cleanSeed();
    await userTestIntegrationHelper.cleanSeed();
  });

  afterAll(async () => {
    await connectionHelper.closeCon();
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
    expect(postsService).toBeDefined();
  });

  describe('index', () => {
    it('should return a post list', async () => {
      // Arrange
      const query: IndexPostDto = {};
      // Act
      const result = await postsController.index(query);
      // Assert
      expect(result.length).toEqual(3);
    });

    it('should a list post by userId', async () => {
      // Arrange
      const { id } = await userTestIntegrationHelper.saveNewFake();
      const query: IndexPostDto = { userId: id };
      // Act
      const result = await postsController.index(query);
      // Assert
      expect(result.length).toEqual(0);
    });
  });

  describe('update', () => {
    it('should update a post successfully', async () => {
      // Arrange
      const { id, description } = await postTestIntegrationHelper.findOne();
      const body: UpdatePostDto = { description: 'updated post' };
      // Act
      const result = await postsController.update(id, body);
      // Assert
      expect(result.description).toEqual(body.description);
      expect(result.description).not.toEqual(description);
      expect(result.updatedAt).toBeDefined();
    });

    it('should throw a not found exception when post is not exists', async () => {
      // Arrange
      const id = '123';
      const body: UpdatePostDto = { description: 'updated post' };
      // Assert
      try {
        await postsController.update(id, body);
      } catch (error) {
        expect(error.response.statusCode).toEqual(404);
        expect(error.response.error).toEqual('Not Found');
      }
    });
  });

  describe('destroy', () => {
    it('should delete a post with success', async () => {
      // Arrange
      const { id } = await postTestIntegrationHelper.findOne();
      // Act
      const result = await postsController.destroy(id);
      // Assert
      expect(result).toBeUndefined();
    });

    it('should thrown a not found exception when post is not exists', async () => {
      // Arrange
      const id = '123';
      // Assert
      try {
        await postsController.destroy(id);
      } catch (error) {
        expect(error.response.statusCode).toEqual(404);
        expect(error.response.error).toEqual('Not Found');
      }
    });
  });
});
