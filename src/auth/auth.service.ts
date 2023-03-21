import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersEntity } from '../app/users/entities/users.entity';
import { UsersService } from '../app/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { IRefreshJWTPayload } from './interfaces/refresh-jwt-payload.interface';
import { IJWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  login(jwtPayload: IJWTPayload) {
    return {
      token: this.generateToken(jwtPayload),
      refreshToken: this.generateRefreshToken(jwtPayload.sub),
    };
  }

  async validateUser(username: string, password: string): Promise<IJWTPayload> {
    let user: UsersEntity;

    try {
      user = await this.usersService.findOneOrFail({ username }, { relations: ['role', 'role.permissions'] });
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return null;

    return {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role.name,
      permissions: user.role.permissions.map((p) => p.name),
    };
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
      user = await this.usersService.findOneOrFail({ refreshTokenId }, { relations: ['role', 'role.permissions'] });
    } catch (error) {
      throw new UnauthorizedException();
    }

    const jwtPayload: IJWTPayload = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions.map((p) => p.name),
    };

    return {
      token: this.generateToken(jwtPayload),
      refreshToken: this.generateRefreshToken(user.id),
    };
  }

  private generateToken(jwtPayload: IJWTPayload) {
    return this.jwtService.sign(jwtPayload);
  }

  private generateRefreshToken(userId: string) {
    const refreshTokenId = uuid();
    this.usersService.updateRefreshTokenId(userId, refreshTokenId);
    const payload: IRefreshJWTPayload = { refreshTokenId };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }
}
