import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConnectionHelper } from '../src/helpers/tests/connection.helper';
import { UserTestIntegrationHelper } from '../src/helpers/tests/user-test-integration.helper';
import { PostTestIntegrationHelper } from '../src/helpers/tests/post-test-integration.helper';
import { StorePostDto } from '../src/app/posts/dto/store-post.dto';
import { UpdatePostDto } from '../src/app/posts/dto/update-post.dto';

describe('nestjs-social-media (e2e)', () => {
  let app: INestApplication;
  const connectionHelper = new ConnectionHelper();
  let userTestIntegrationHelper: UserTestIntegrationHelper;
  let postTestIntegrationHelper: PostTestIntegrationHelper;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

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
    await app.close();
  });

  describe('App', () => {
    it('should return a hello world message', () => {
      return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
    });
  });

  describe('Posts', () => {
    it('should return a posts list', () => {
      // Act
      return request(app.getHttpServer())
        .get('/api/v1/posts')
        .expect(200)
        .expect((response) => {
          expect(response.body.length).toEqual(3);
        });
    });

    it('should update a post with success', async () => {
      // Arrange
      const { id } = await postTestIntegrationHelper.findOne();
      const body: UpdatePostDto = { description: 'updated description' };
      // Act
      return request(app.getHttpServer())
        .put(`/api/v1/posts/${id}`)
        .send(body)
        .expect(200)
        .expect((response) => {
          expect(response.body.description).toEqual(body.description);
        });
    });

    it('should throw a bad request exception when id is invalid', async () => {
      // Arrange
      const id = '123';
      const body: UpdatePostDto = { description: 'updated description' };
      // Act
      return request(app.getHttpServer())
        .put(`/api/v1/posts/${id}`)
        .send(body)
        .expect(400)
        .expect((response) => {
          expect(response.body.message).toBeDefined();
        });
    });

    it('should delete a post with success', async () => {
      // Arrange
      const { id } = await postTestIntegrationHelper.findOne();
      // Act
      return request(app.getHttpServer()).delete(`/api/v1/posts/${id}`).expect(204);
    });

    it('should throw a bad request when the id is invalid', async () => {
      // Arrange
      const id = '123';
      // Act
      return request(app.getHttpServer()).delete(`/api/v1/posts/${id}`).expect(400);
    });
  });

  describe('Users', () => {
    it('should store a new post with success', async () => {
      // Arrange
      const { id: userId } = await userTestIntegrationHelper.findOne();
      const body: StorePostDto = { description: 'new post' };
      // Act
      return request(app.getHttpServer()).post(`/api/v1/users/${userId}/posts`).send(body).expect(201);
    });
  });
});
