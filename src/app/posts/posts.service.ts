import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndexPostDto } from './dto/index-post.dto';
import { StorePostDto } from './dto/store-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsEntity } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  async index(options: IndexPostDto) {
    const posts = this.postsRepository
      .createQueryBuilder('posts')
      .addSelect(['user.username'])
      .leftJoin('posts.user', 'user');

    if (options?.userId) {
      posts.andWhere('posts.userId = :userId', { userId: options.userId });
    }

    return await posts.getMany();
  }

  async store(userId: string, data: StorePostDto) {
    return await this.postsRepository.save(this.postsRepository.create({ userId, ...data }));
  }

  async update(id: string, data: UpdatePostDto) {
    const post = await this.postsRepository.findOneOrFail({ id });

    this.postsRepository.merge(post, data);
    return await this.postsRepository.save(post);
  }

  async destroy(id: string) {
    await this.postsRepository.findOneOrFail({ id });
    await this.postsRepository.softDelete({ id });
  }
}
