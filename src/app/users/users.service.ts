import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreUserDto } from './dto/store-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async index() {
    return this.usersRepository.find();
  }

  async store(data: StoreUserDto) {
    return await this.usersRepository.save(this.usersRepository.create(data));
  }

  async show(id: string) {
    return await this.usersRepository.findOneOrFail({ id });
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.usersRepository.findOneOrFail({ id });

    this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  async destroy(id: string) {
    await this.usersRepository.findOneOrFail({ id });
    await this.usersRepository.softDelete({ id });
  }
}
