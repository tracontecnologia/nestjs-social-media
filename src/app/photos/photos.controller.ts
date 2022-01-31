import { Controller, Delete, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PhotosService } from './photos.service';

@Controller('api/v1/photos')
@ApiTags('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Delete(':id')
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.photosService.destroy(id);
  }
}
