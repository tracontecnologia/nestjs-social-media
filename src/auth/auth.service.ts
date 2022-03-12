import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../app/users/entities/users.entity';
import { UsersService } from '../app/users/users.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, password: string) {
    let user: UsersEntity;

    try {
      user = await this.usersService.findOneOrFail({ username });
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
