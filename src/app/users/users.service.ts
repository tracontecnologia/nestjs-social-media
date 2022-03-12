import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import { StoreFollowerDto } from './dto/store-follower.dto';
import { StoreUserDto } from './dto/store-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly postsService: PostsService,
  ) {}

  async index() {
    return this.usersRepository.find();
  }

  async store(data: StoreUserDto) {
    return await this.usersRepository.save(this.usersRepository.create(data));
  }

  async show(id: string) {
    return await this.usersRepository.findOneOrFail({ id }, { relations: ['userProfiles'] });
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.usersRepository.findOneOrFail({ id });

    this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  async destroy(id: string) {
    await this.usersRepository.findOneOrFail({ id });
    await this.usersRepository.softDelete({ id });
  }

  async indexFollowers(id: string) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id', 'users.firstName', 'users.lastName'])
      .addSelect(['followers.id', 'followers.firstName', 'followers.lastName'])
      .leftJoin('users.followers', 'followers')
      .where('users.id = :id', { id })
      .getOneOrFail();
  }

  async storeFollowers(id: string, data: StoreFollowerDto) {
    let user: UsersEntity;
    try {
      user = await this.usersRepository.findOneOrFail({ id }, { relations: ['followers'] });
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    let follower: UsersEntity;
    try {
      follower = await this.usersRepository.findOneOrFail({ id: data.followerId });
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    user.followers = user.followers || [];

    if (user.followers.find((follower) => follower.id === data.followerId)) {
      throw new BadRequestException('Esse usuário já é um seguidor');
    }

    user.followers.push(follower);

    return await this.usersRepository.save(user);
  }

  async getFollows(followerId: string) {
    return await this.usersRepository
      .createQueryBuilder('users')
      .select(['users.id', 'users.firstName', 'users.lastName', 'users.username'])
      .leftJoin('users.followers', 'followers')
      .where('follower_id = :followerId', { followerId })
      .getMany();
  }

  async getFollowsPosts(followerId: string) {
    const follows = await this.getFollows(followerId);
    const followsIds = follows.map(({ id }) => id);
    return await this.postsService.index({ userIds: followsIds });
  }

  async findOneOrFail(conditions?: FindConditions<UsersEntity>, options?: FindOneOptions<UsersEntity>) {
    try {
      return this.usersRepository.findOneOrFail(conditions, options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
