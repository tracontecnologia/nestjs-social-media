import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndexPostDto } from './dto/index-post.dto';
import { PostsEntity } from './entities/posts.entity';
import { PostsService } from './posts.service';

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
            addSelect: jest.fn().mockReturnThis(),
            leftJoin: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
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
      const options = {};
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
});
