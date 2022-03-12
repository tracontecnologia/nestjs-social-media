import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestResponse, NotFoundResponse } from '../../shared/swagger.shared';
import { PhotosService } from '../photos/photos.service';
import { PhotosResponse } from '../photos/photos.swagger';
import { IndexPostDto } from './dto/index-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { PostIndexResponse, PostPutResponse } from './posts.swagger';

@Controller('api/v1/posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService, private readonly photosService: PhotosService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Retornar todos os posts' })
  @ApiResponse({
    type: PostIndexResponse,
    isArray: true,
    status: HttpStatus.OK,
    description:
      'Listagem de todos os posts de todos os usuários ou de algum usuário específico conforme o parâmetro informado',
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  async index(@Query() query: IndexPostDto) {
    return await this.postsService.index(query);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Atualizar um post' })
  @ApiResponse({ type: PostPutResponse, status: HttpStatus.OK, description: 'Post atualizado com sucesso' })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Post não foi encontrado ou não existe',
  })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdatePostDto) {
    return await this.postsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Excluir um post' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Post excluído com sucesso' })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Post não foi encontrado ou não existe',
  })
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.postsService.destroy(id);
  }

  @Get(':id/photos')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Listar todas as fotos de um post' })
  @ApiResponse({
    type: PhotosResponse,
    isArray: true,
    status: HttpStatus.OK,
    description: 'Listagem de todas as fotos do post',
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Post não foi encontrado ou não existe',
  })
  async indexPhotos(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.photosService.index(id);
  }

  @Post(':id/photos')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Realizar o upload de novas fotos em um post' })
  @UseInterceptors(FilesInterceptor('files', 6, { limits: { fileSize: 5000000 } }))
  @ApiResponse({
    type: PhotosResponse,
    isArray: true,
    status: HttpStatus.OK,
    description: 'O upload da foto foi realizado com sucesso',
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Post não foi encontrado ou não existe',
  })
  async storePhotos(@Param('id', new ParseUUIDPipe()) id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.photosService.store(id, files);
  }
}
