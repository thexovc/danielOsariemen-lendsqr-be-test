import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, loginDto } from './dto/auth.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    const res = await this.authService.register(registerDto);

    if (
      res?.error &&
      res?.message.toLowerCase() == 'Email In Karma Blacklist'.toLowerCase()
    ) {
      throw new HttpException(res?.message, HttpStatus.FORBIDDEN);
    }

    return res;
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginData: loginDto) {
    const res = await this.authService.login(loginData);
    return res;
  }
}
