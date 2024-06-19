import { RegisterDto, loginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private readonly configService;
    private jwtService;
    private readonly knex;
    private readonly httpService;
    private readonly saltRounds;
    constructor(configService: ConfigService, jwtService: JwtService, knex: Knex, httpService: HttpService);
    login(loginData: loginDto): Promise<any>;
    register(createUserData: RegisterDto): Promise<{
        message?: string;
        error?: boolean;
        user?: any;
    }>;
}
