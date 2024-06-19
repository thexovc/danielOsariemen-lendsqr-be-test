"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const config_1 = require("@nestjs/config");
const knex_1 = require("knex");
const jwt_1 = require("@nestjs/jwt");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
let AuthService = class AuthService {
    constructor(configService, jwtService, knex, httpService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.knex = knex;
        this.httpService = httpService;
        this.saltRounds = 10;
    }
    async login(loginData) {
        const existingUser = await this.knex('users')
            .where({
            email: loginData.email,
        })
            .first();
        if (!existingUser) {
            throw new common_1.NotFoundException('Email is invalid');
        }
        const passwordMatch = await bcrypt.compare(loginData.password, existingUser.password);
        if (!passwordMatch) {
            throw new common_1.HttpException('password incorrect', common_1.HttpStatus.UNAUTHORIZED);
        }
        const access_token = await this.jwtService.signAsync({ ...existingUser });
        const { password, ...rest } = existingUser;
        return { access_token, data: rest };
    }
    async register(createUserData) {
        const existingUser = await this.knex('users')
            .where({
            email: createUserData.email,
        })
            .first();
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        try {
            const url = `${this.configService.get('ADJUTOR_BASE_URL')}/v2/verification/karma/${createUserData.email}`;
            await (0, rxjs_1.firstValueFrom)(this.httpService.get(url, {
                headers: {
                    Authorization: `Bearer ${this.configService.get('ADJUTOR_SECRET')}`,
                },
            }));
            return {
                error: true,
                message: 'Email In Karma Blacklist',
            };
        }
        catch (error) {
            const { password, email, ...data } = createUserData;
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            const [userId] = await this.knex('users')
                .insert({
                email,
                password: hashedPassword,
                ...data,
            })
                .returning('id');
            const newUser = await this.knex('users').where('id', userId).first();
            return {
                message: 'registration successful!',
                user: newUser,
            };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('KNEX_CONNECTION')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService, Function, axios_1.HttpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map