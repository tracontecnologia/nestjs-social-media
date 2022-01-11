import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosEntity } from './entities/photos.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(PhotosEntity)
    private readonly photosRepository: Repository<PhotosEntity>,
  ) {}

  async index(postId: string) {
    return await this.photosRepository.find({ postId });
  }

  async store(postId: string) {
    const photoUrl = Math.random() + '.png';

    const photo = this.photosRepository.create({ postId, photoUrl });
    return await this.photosRepository.save(photo);
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
