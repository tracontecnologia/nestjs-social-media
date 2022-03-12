import { Injectable } from '@nestjs/common';
import { UsersEntity } from '../app/users/entities/users.entity';
import { UsersService } from '../app/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  login(user) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

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
