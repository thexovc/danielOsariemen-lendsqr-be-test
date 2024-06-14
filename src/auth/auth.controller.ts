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
    try {
      const res = await this.authService.register(registerDto);

      if (
        res?.error &&
        res?.message.toLowerCase() == 'Email In Karma Blacklist'.toLowerCase()
      ) {
        throw new HttpException(res?.message, HttpStatus.FORBIDDEN);
      }

      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginData: loginDto) {
    try {
      const res = await this.authService.login(loginData);
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
}
