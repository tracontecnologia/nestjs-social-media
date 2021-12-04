import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async index() {
    return this.usersService.index();
  }

  @Post()
  async store(@Body() body) {
    return this.usersService.store(body);
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    return this.usersService.show(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id') id: string) {
    await this.usersService.destroy(id);
  }
}
