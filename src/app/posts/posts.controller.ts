import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';
import { IndexPostDto } from './dto/index-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('api/v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async index(@Query() query: IndexPostDto) {
    return await this.postsService.index(query);
  }

  @Put(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: UpdatePostDto) {
    return await this.postsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.postsService.destroy(id);
  }
}
