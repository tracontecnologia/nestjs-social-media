import { Controller, Delete, HttpCode, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundResponse } from '../../shared/swagger.shared';
import { PhotosService } from './photos.service';

@Controller('api/v1/photos')
@ApiTags('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir uma foto' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Foto excluída com sucesso' })
  @ApiResponse({ type: NotFoundResponse, status: HttpStatus.NOT_FOUND, description: 'A foto não existe' })
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.photosService.destroy(id);
  }
}
