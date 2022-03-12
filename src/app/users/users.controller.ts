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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Listar todos os usuários' })
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
  @ApiOperation({ summary: 'Inserir um novo usuário' })
  @ApiResponse({ type: UserResponse, status: HttpStatus.CREATED, description: 'Novo usuário criado com sucesso!' })
  @ApiResponse({ type: BadRequestResponse, description: 'Informe os parâmetros de forma correta' })
  async store(@Body() body: StoreUserDto) {
    return this.usersService.store(body);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Buscar um usuário pelo id' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Atualizar todos os campos de um usuário' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Atualizar alguns campos de um usuário' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Excluir um usuário' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Cadastar um novo post para um usuário' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Listar todos os posts de um usuário' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Listar todos os seguidores de um usuário' })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Registar um novo seguidor para um usuário' })
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

  @Get(':id/follows')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Listar todos os usuários que o usuário selecionado segue' })
  @ApiResponse({
    type: UserFollowersResponse,
    status: HttpStatus.OK,
    description: 'Retornar uma lista de usuários',
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
  async getFollows(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getFollows(id);
  }

  @Get(':id/follows/posts')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Listar todos os posts dos usuários que o usuário selecionado segue' })
  @ApiResponse({
    type: UserFollowersResponse,
    status: HttpStatus.OK,
    description: 'Retornar uma lista de posts',
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
  async getFollowsPosts(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getFollowsPosts(id);
  }
}
