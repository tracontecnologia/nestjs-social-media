import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosEntity } from '../photos/entities/photos.entity';
import { PhotosService } from '../photos/photos.service';
import { IndexPostDto } from './dto/index-post.dto';
import { StorePostDto } from './dto/store-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsEntity } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly photosService: PhotosService,
  ) {}

  async index(options?: IndexPostDto) {
    const posts = this.postsRepository
      .createQueryBuilder('posts')
      .addSelect(['user.username'])
      .addSelect(['photos.photoUrl'])
      .leftJoin('posts.user', 'user')
      .leftJoin('posts.photos', 'photos');

    if (options?.userId) {
      posts.andWhere('posts.userId = :userId', { userId: options.userId });
    } else if (options?.userIds) {
      posts.andWhere('posts.userId IN (:userIds)', { userIds: options.userIds });
    }

    return await posts.getMany();
  }

  async store(userId: string, data: StorePostDto, files: Express.Multer.File[]) {
    let post: PostsEntity;
    try {
      post = await this.postsRepository.save(this.postsRepository.create({ userId, ...data }));
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    let photos: PhotosEntity[];
    try {
      photos = await this.photosService.store(post.id, files);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return { post, photos };
  }

  async update(id: string, data: UpdatePostDto) {
    let post: PostsEntity;
    try {
      post = await this.postsRepository.findOneOrFail({ id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    this.postsRepository.merge(post, data);
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async destroy(id: string) {
    try {
      await this.postsRepository.findOneOrFail({ id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    try {
      await this.postsRepository.softDelete({ id });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
