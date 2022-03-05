import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndexPostDto } from '../dto/index-post.dto';
import { StorePostDto } from '../dto/store-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsEntity } from '../entities/posts.entity';
import { PostsService } from '../posts.service';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: Repository<PostsEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostsEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnThis(),
            create: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
            save: jest.fn().mockResolvedValue(undefined),
            findOneOrFail: jest.fn().mockResolvedValue(undefined),
            merge: jest.fn().mockReturnValue(undefined),
            softDelete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<Repository<PostsEntity>>(getRepositoryToken(PostsEntity));
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
    expect(postsRepository).toBeDefined();
  });

  describe('index', () => {
    it('should return a posts list', async () => {
      // Arrange
      const options = undefined;
      const postsListMock = [
        {
          id: '1',
          userId: '1',
          description: 'test1',
          createdAt: '2022-02-26T12:00:00',
          updatedAt: '2022-02-26T12:00:00',
          deletedAt: null,
          user: undefined,
        },
        {
          id: '1',
          userId: '1',
          description: 'test1',
          createdAt: '2022-02-26T12:00:00',
          updatedAt: '2022-02-26T12:00:00',
          deletedAt: null,
          user: undefined,
        },
      ];
      jest.spyOn(postsRepository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(postsListMock);
      // Act
      const result = await postsService.index(options);
      // Assert
      expect(result).toEqual(postsListMock);
      expect(result.length).toEqual(postsListMock.length);
    });

    it('should return an empty posts list', async () => {
      // Arrange
      const options = {};
      const postsListMock = [];
      jest.spyOn(postsRepository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(postsListMock);
      // Act
      const result = await postsService.index(options);
      // Assert
      expect(result).toEqual(postsListMock);
      expect(result.length).toEqual(postsListMock.length);
    });

    it('should return a posts list by userId', async () => {
      // Arrange
      const options: IndexPostDto = { userId: '2' };
      const postsListMock = [
        {
          id: '1',
          userId: '2',
          description: 'test1',
          createdAt: '2022-02-26T12:00:00',
          updatedAt: '2022-02-26T12:00:00',
          deletedAt: null,
          user: undefined,
        },
      ];
      jest.spyOn(postsRepository.createQueryBuilder(), 'getMany').mockResolvedValueOnce(postsListMock);
      // Act
      const result = await postsService.index(options);
      // Assert
      expect(result).toEqual(postsListMock);
    });
  });

  describe('store', () => {
    it('should store a new post', async () => {
      // Arrange
      const userId = '1';
      const data: StorePostDto = { description: 'test' };
      const postMock: PostsEntity = {
        id: '1',
        userId: '1',
        user: undefined,
        description: 'test',
        createdAt: '2022-02-26T12:00:00',
        updatedAt: '2022-02-26T12:00:00',
        deletedAt: '2022-02-26T12:00:00',
      };
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(postMock);
      // Act
      const result = await postsService.store(userId, data);
      // Assert
      expect(result).toEqual(postMock);
    });

    it('should throw an exception', () => {
      // Arrange
      const userId = '1';
      const data: StorePostDto = { description: 'test' };
      jest.spyOn(postsRepository, 'save').mockRejectedValueOnce(new Error());
      // Assert
      expect(postsService.store(userId, data)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a post with success', async () => {
      // Arrange
      const id = '1';
      const data: UpdatePostDto = { description: 'updated test' };
      const postFoundMock: PostsEntity = {
        id: '1',
        userId: '1',
        user: undefined,
        description: 'test',
        createdAt: '2022-02-26T12:00:00',
        updatedAt: '2022-02-26T12:00:00',
        deletedAt: '2022-02-26T12:00:00',
      };
      jest.spyOn(postsRepository, 'findOneOrFail').mockResolvedValueOnce(postFoundMock);
      const postMock: PostsEntity = {
        id: '1',
        userId: '1',
        user: undefined,
        description: 'updated test',
        createdAt: '2022-02-26T12:00:00',
        updatedAt: '2022-02-26T12:00:00',
        deletedAt: '2022-02-26T12:00:00',
      };
      jest.spyOn(postsRepository, 'save').mockResolvedValueOnce(postMock);
      // Act
      const result = await postsService.update(id, data);
      // Assert
      expect(result).toEqual(postMock);
    });

    it('should throw an exception when post is not exists', () => {
      // Arrange
      const id = '1';
      const data: UpdatePostDto = { description: 'updated test' };
      jest.spyOn(postsRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());
      // Assert
      expect(postsService.update(id, data)).rejects.toThrowError(NotFoundException);
    });

    it('should throw an exception when post is not updated', () => {
      // Arrange
      const id = '1';
      const data: UpdatePostDto = { description: 'updated test' };
      jest.spyOn(postsRepository, 'save').mockRejectedValueOnce(new Error());
      // Assert
      expect(postsService.update(id, data)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('destroy', () => {
    it('should delete a post with success', async () => {
      // Arrange
      const id = '1';
      // Act
      const result = await postsService.destroy(id);
      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception when post is not exists', () => {
      // Arrange
      const id = '1';
      jest.spyOn(postsRepository, 'findOneOrFail').mockRejectedValueOnce(new Error());
      // Assert
      expect(postsService.destroy(id)).rejects.toThrowError(NotFoundException);
    });

    it('should throw an exception when post is not deleted with success', () => {
      // Arrange
      const id = '1';
      jest.spyOn(postsRepository, 'softDelete').mockRejectedValueOnce(new Error());
      // Assert
      expect(postsService.destroy(id)).rejects.toThrowError(BadRequestException);
    });
  });
});
