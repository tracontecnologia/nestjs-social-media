import { Controller, Post } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  @Post('login')
  async login() {
    return null;
  }
}
