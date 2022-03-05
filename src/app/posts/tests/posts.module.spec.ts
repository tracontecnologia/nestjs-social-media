import { PostsModule } from '../posts.module';

describe('PostsModule', () => {
  let postsModule: PostsModule;

  beforeEach(() => {
    postsModule = new PostsModule();
  });

  it('should be defined', () => {
    expect(postsModule).toBeDefined();
  });
});
