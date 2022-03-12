import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersEntity } from '../app/users/entities/users.entity';
import { UsersService } from '../app/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUserJWTPayload } from './interfaces/user-jwt-payload.interface';
import { IJWTPayload } from './interfaces/jwt-payload.interface';
import { v4 as uuid } from 'uuid';
import { IRefreshJWTPayload } from './interfaces/refresh-jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  login(user: IUserJWTPayload) {
    return {
      token: this.generateToken(user),
      refreshToken: this.generateRefreshToken(user.id),
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

  async refreshToken(refreshToken: string) {
    let payload: IRefreshJWTPayload;
    try {
      payload = this.jwtService.decode(refreshToken, { json: true }) as IRefreshJWTPayload;
    } catch (error) {
      throw new UnauthorizedException();
    }

    const { refreshTokenId } = payload;

    let user: UsersEntity;
    try {
      user = await this.usersService.findOneOrFail({ refreshTokenId });
    } catch (error) {
      throw new UnauthorizedException();
    }

    return {
      token: this.generateToken(user),
      refreshToken: this.generateRefreshToken(user.id),
    };
  }

  private generateToken(user: IUserJWTPayload) {
    const payload: IJWTPayload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(userId: string) {
    const refreshTokenId = uuid();
    this.usersService.updateRefreshTokenId(userId, refreshTokenId);
    const payload: IRefreshJWTPayload = { refreshTokenId };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }
}
