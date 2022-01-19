import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { PhotosEntity } from './entities/photos.entity';
import * as sharp from 'sharp';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(PhotosEntity)
    private readonly photosRepository: Repository<PhotosEntity>,
  ) {}

  async index(postId: string) {
    return await this.photosRepository.find({ postId });
  }

  async store(postId: string, files: Express.Multer.File[]) {
    const uploadDir = join(__dirname, '..', '..', '..', 'client', 'posts', postId);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const photos = await Promise.all(
      files.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileDir = `${uploadDir}/${fileName}`;
        const fileBuffer = await sharp(file.buffer)
          .resize(400, 400, { fit: 'contain', background: '#ffffff' })
          .toBuffer();

        writeFileSync(fileDir, fileBuffer);

        return this.photosRepository.create({ postId, photoUrl: `/posts/${postId}/${fileName}` });
      }),
    );

    return await this.photosRepository.save(photos);
  }

  async destroy(id: string) {
    try {
      await this.photosRepository.findOneOrFail({ id });
    } catch (error) {
      throw new NotFoundException(error.message);
    }

    await this.photosRepository.softDelete({ id });
  }
}
