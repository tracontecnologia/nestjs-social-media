import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PhotosEntity } from '../../photos/entities/photos.entity';
import { PhotosService } from '../../photos/photos.service';
import { IndexPostDto } from '../dto/index-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsEntity } from '../entities/posts.entity';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;
  let photosService: PhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            index: jest.fn().mockResolvedValue([]),
            update: jest.fn().mockResolvedValue(undefined),
            destroy: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: PhotosService,
          useValue: {
            index: jest.fn().mockResolvedValue([]),
            store: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
    photosService = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
    expect(postsService).toBeDefined();
    expect(photosService).toBeDefined();
  });

  describe('index', () => {
    it('should return a posts list', async () => {
      // Arrange
      const query: IndexPostDto = {};
      const postsListMock: PostsEntity[] = [
        {
          id: '1',
          userId: '1',
          user: undefined,
          description: 'test',
          createdAt: '2022-02-26T12:00:00',
          updatedAt: '2022-02-26T12:00:00',
          deletedAt: null,
        },
      ];
      jest.spyOn(postsService, 'index').mockResolvedValueOnce(postsListMock);
      // Act
      const result = await postsController.index(query);
      // Assert
      expect(result).toEqual(postsListMock);
    });

    it('should return a posts list by userId', async () => {
      // Arrange
      const query: IndexPostDto = { userId: '2' };
      const postsListMock: PostsEntity[] = [
        {
          id: '2',
          userId: '2',
          user: undefined,
          description: 'test',
          createdAt: '2022-02-26T12:00:00',
          updatedAt: '2022-02-26T12:00:00',
          deletedAt: null,
        },
      ];
      jest.spyOn(postsService, 'index').mockResolvedValueOnce(postsListMock);
      // Act
      const result = await postsController.index(query);
      // Assert
      expect(result).toEqual(postsListMock);
      expect(result[0].userId).toEqual(query.userId);
    });
  });

  describe('update', () => {
    it('should update a post with success', async () => {
      // Arrange
      const id = '1';
      const body: UpdatePostDto = { description: 'updated test' };
      const postMock: PostsEntity = {
        id: '1',
        userId: '1',
        user: undefined,
        description: 'updated test',
        createdAt: '2022-02-26T12:00:00',
        updatedAt: '2022-02-26T12:00:00',
        deletedAt: null,
      };
      jest.spyOn(postsService, 'update').mockResolvedValueOnce(postMock);
      // Act
      const result = await postsController.update(id, body);
      // Assert
      expect(result).toEqual(postMock);
      expect(result.description).toEqual(body.description);
    });

    it('should throw an exception when post is not exists', () => {
      // Arrange
      const id = '3';
      const body: UpdatePostDto = { description: 'updated test' };
      jest.spyOn(postsService, 'update').mockRejectedValueOnce(new NotFoundException());
      // Assert
      expect(postsController.update(id, body)).rejects.toThrowError(NotFoundException);
    });

    it('should throw an exception when post is not updated with success', () => {
      // Arrange
      const id = '1';
      const body: UpdatePostDto = { description: 'updated test' };
      jest.spyOn(postsService, 'update').mockRejectedValueOnce(new BadRequestException());
      // Assert
      expect(postsController.update(id, body)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('destroy', () => {
    it('should delete post with success', async () => {
      // Arrange
      const id = '1';
      // Act
      const result = await postsController.destroy(id);
      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception when post is not exists', () => {
      // Arrange
      const id = '1';
      jest.spyOn(postsService, 'destroy').mockRejectedValueOnce(new NotFoundException());
      // Assert
      expect(postsController.destroy(id)).rejects.toThrowError(NotFoundException);
    });

    it('should throw an exception when post is not deleted with success', () => {
      // Arrange
      const id = '1';
      jest.spyOn(postsService, 'destroy').mockRejectedValueOnce(new BadRequestException());
      // Assert
      expect(postsController.destroy(id)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('indexPhotos', () => {
    it('should return a photos list', async () => {
      // Arrange
      const id = '1';
      const photosListMock: PhotosEntity[] = [
        {
          id: '1',
          postId: '1',
          photoUrl: '/img/photo1.png',
          createdAt: '2022-02-26T12:00:00',
          updatedAt: '2022-02-26T12:00:00',
          deletedAt: '2022-02-26T12:00:00',
        },
      ];
      jest.spyOn(photosService, 'index').mockResolvedValueOnce(photosListMock);
      // Act
      const result = await postsController.indexPhotos(id);
      // Assert
      expect(result).toEqual(photosListMock);
      expect(result.length).toEqual(photosListMock.length);
    });
  });

  describe('storePhotos', () => {
    it('should store a new photo with success', async () => {
      // Arrange
      const id = '1';
      const files: Express.Multer.File[] = [
        {
          fieldname: '',
          originalname: '',
          encoding: '',
          mimetype: '',
          size: 100,
          stream: undefined,
          destination: '',
          filename: '',
          path: '',
          buffer: Buffer.from([]),
        },
      ];
      const photosListMock: PhotosEntity[] = [
        {
          id: '1',
          postId: '1',
          photoUrl: '/img/photo1.pngƒ',
          createdAt: '2022-02-26T12:00:00',
          updatedAt: '2022-02-26T12:00:00',
          deletedAt: '2022-02-26T12:00:00',
        },
      ];
      jest.spyOn(photosService, 'store').mockResolvedValueOnce(photosListMock);
      // Assert
      const result = await postsController.storePhotos(id, files);
      // Assert
      expect(result).toEqual(photosListMock);
      expect(result.length).toEqual(photosListMock.length);
    });
  });
});
