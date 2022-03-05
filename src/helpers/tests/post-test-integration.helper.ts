import { PostsEntity } from '../../app/posts/entities/posts.entity';
import { TestIntegrationHelper } from './test-integration.helper';
import { faker } from '@faker-js/faker';

export class PostTestIntegrationHelper extends TestIntegrationHelper {
  async seed(params: { userId: string }): Promise<void> {
    const posts: PostsEntity[] = [this.getFakeData(params), this.getFakeData(params), this.getFakeData(params)];
    await this.entityManager.save(PostsEntity, posts);
  }

  async cleanSeed(): Promise<void> {
    await this.entityManager.query(`SET FOREIGN_KEY_CHECKS=0;`);
    const posts = await this.entityManager.find(PostsEntity);
    await this.entityManager.remove(PostsEntity, posts);
  }

  getFakeData(params: { userId: string }) {
    return this.entityManager.create(PostsEntity, {
      userId: params.userId,
      description: faker.lorem.lines(1),
    });
  }

  async findOne(): Promise<PostsEntity> {
    return this.entityManager.findOne(PostsEntity);
  }
}
