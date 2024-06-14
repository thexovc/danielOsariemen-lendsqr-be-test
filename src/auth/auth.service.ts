import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto, loginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
    private readonly httpService: HttpService,
  ) {}

  //  login
  async login(loginData: loginDto): Promise<any> {
    const existingUser = await this.knex('users')
      .where({
        email: loginData.email,
      })
      .first();

    if (!existingUser) {
      throw new NotFoundException('Email is invalid');
    }

    const passwordMatch = await bcrypt.compare(
      loginData.password,
      existingUser.password,
    );

    if (!passwordMatch) {
      throw new HttpException('password incorrect', HttpStatus.UNAUTHORIZED);
    }

    const access_token = await this.jwtService.signAsync({ ...existingUser });

    const { password, ...rest } = existingUser;

    return { access_token, data: rest };
  }

  //   register
  async register(createUserData: RegisterDto): Promise<{
    message?: string;
    error?: boolean;
    user?: any;
  }> {
    const existingUser = await this.knex('users')
      .where({
        email: createUserData.email,
      })
      .first();

    // console.log({ existingUser });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    try {
      const url = `${this.configService.get<string>('ADJUTOR_BASE_URL')}/v2/verification/karma/${createUserData.email}`;

      await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Bearer ${this.configService.get<string>('ADJUTOR_SECRET')}`,
          },
        }),
      );

      return {
        error: true,
        message: 'Email In Karma Blacklist',
      };
    } catch (error) {
      const { password, email, ...data } = createUserData;

      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      let api_key = this.generateUniqueApiKey();

      // Check if api_key already exists, if so, generate another one
      while (await this.apiKeyExists(api_key)) {
        api_key = this.generateUniqueApiKey();
      }

      const [userId] = await this.knex('users')
        .insert({
          email,
          password: hashedPassword,
          api_key,
          ...data,
        })
        .returning('id'); // 'returning' ensures the ID is returned

      const newUser = await this.knex('users').where('id', userId).first();

      // await this.generateAndSendToken(newUser.email);

      return {
        message: 'registration successful!',
        user: newUser,
      };
    }
  }

  private generateUniqueApiKey(): string {
    // Generate a unique API key
    return uuidv4();
  }

  private async apiKeyExists(api_key: string): Promise<boolean> {
    const user = await this.knex('users').where({ api_key }).first();

    return !!user; // This will return true if user is found, false otherwise
  }

  // private async generateAndSendToken(email: string) {
  //   const user = await this.prisma.user.findUnique({ where: { email } });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const token = this.jwtService.signAsync({ id: user.id });

  //   const confirmationLink = `${this.configService.get<string>('WEB_URL')}/verification/${token}`;

  //   // this.emailsService.sendConfirmEmail(user, confirmationLink);
  // }
}
