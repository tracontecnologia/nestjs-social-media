import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestResponse, NotFoundResponse } from '../../shared/swagger.shared';
import { StorePostDto } from '../posts/dto/store-post.dto';
import { PostsService } from '../posts/posts.service';
import { PostResponse } from '../posts/posts.swagger';
import { PatchUserDto } from './dto/patch-user.dto';
import { StoreFollowerDto } from './dto/store-follower.dto';
import { StoreUserDto } from './dto/store-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserFollowersResponse, UserResponse } from './users.swagger';

@Controller('api/v1/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly postsService: PostsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({
    type: UserResponse,
    isArray: true,
    status: HttpStatus.OK,
    description: 'Listagem de todos os usuários',
  })
  async index() {
    return this.usersService.index();
  }

  @Post()
  @ApiResponse({ type: UserResponse, status: HttpStatus.CREATED, description: 'Novo usuário criado com sucesso!' })
  @ApiResponse({ type: BadRequestResponse, description: 'Informe os parâmetros de forma correta' })
  async store(@Body() body: StoreUserDto) {
    return this.usersService.store(body);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: UserResponse, status: HttpStatus.OK, description: 'Usuário retornado com sucesso' })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado ou não existe',
  })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.show(id);
  }

  @Put(':id')
  @ApiResponse({ type: UserResponse, status: HttpStatus.OK, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado ou não existe',
  })
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Patch(':id')
  @ApiResponse({ type: UserResponse, status: HttpStatus.OK, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado ou não existe',
  })
  async patch(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: PatchUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Usuário excluído com sucesso' })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado ou não existe',
  })
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.usersService.destroy(id);
  }

  @Post(':id/posts')
  @ApiResponse({ type: PostResponse, status: HttpStatus.CREATED, description: 'Post do usuário criado com sucesso!' })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado ou não existe',
  })
  async storePost(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: StorePostDto) {
    return this.postsService.store(id, body);
  }

  @Get(':id/posts')
  @ApiResponse({
    type: PostResponse,
    isArray: true,
    status: HttpStatus.OK,
    description: 'Listagem de todos os posts do usuário selecionado',
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  async indexPosts(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.postsService.index({ userId: id });
  }

  @Get(':id/followers')
  @ApiResponse({
    type: UserFollowersResponse,
    status: HttpStatus.OK,
    description: 'Retornar todos os seguidores de um usuário',
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado ou não existe',
  })
  async indexFollowers(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.indexFollowers(id);
  }

  @Post(':id/followers')
  @ApiResponse({
    type: UserFollowersResponse,
    status: HttpStatus.CREATED,
    description: 'Novo seguidor adicionado com sucesso',
  })
  @ApiResponse({
    type: BadRequestResponse,
    status: HttpStatus.BAD_REQUEST,
    description: 'Informe os parâmetros de forma correta',
  })
  @ApiResponse({
    type: NotFoundResponse,
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado ou não existe',
  })
  async storeFollowers(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: StoreFollowerDto) {
    return this.usersService.storeFollowers(id, body);
  }
}
