import {
  Body,
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
} from '@nestjs/common';
import { PatchUserDto } from './dto/patch-user.dto';
import { StoreUserDto } from './dto/store-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async index() {
    return this.usersService.index();
  }

  @Post()
  async store(@Body() body: StoreUserDto) {
    return this.usersService.store(body);
  }

  @Get(':id')
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.show(id);
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
}
