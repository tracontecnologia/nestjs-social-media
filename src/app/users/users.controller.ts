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
import { ApiTags } from '@nestjs/swagger';
import { StorePostDto } from '../posts/dto/store-post.dto';
import { PostsService } from '../posts/posts.service';
import { PatchUserDto } from './dto/patch-user.dto';
import { StoreFollowerDto } from './dto/store-follower.dto';
import { StoreUserDto } from './dto/store-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly postsService: PostsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async index() {
    return this.usersService.index();
  }

  @Post()
  async store(@Body() body: StoreUserDto) {
    return this.usersService.store(body);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.usersService.show(id);
  }

  @Put(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Patch(':id')
  async patch(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: PatchUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.usersService.destroy(id);
  }

  @Post(':id/posts')
  async storePost(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: StorePostDto) {
    return this.postsService.store(id, body);
  }

  @Get(':id/posts')
  async indexPosts(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.postsService.index({ userId: id });
  }

  @Get(':id/followers')
  async indexFollowers(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.indexFollowers(id);
  }

  @Post(':id/followers')
  async storeFollowers(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: StoreFollowerDto) {
    return this.usersService.storeFollowers(id, body);
  }
}
