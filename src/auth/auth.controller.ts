import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, loginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    try {
      const res = await this.authService.register(registerDto);
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  // @Post('login')
  // async login(@Body(new ValidationPipe()) loginData: loginDto) {
  //   try {
  //     const res = await this.authService.login(loginData);
  //     return res;
  //   } catch (error) {
  //     console.log({ error });
  //     throw error;
  //   }
  // }
}
