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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const class_transformer_1 = require("class-transformer");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(knex) {
        this.knex = knex;
    }
    async getUser(user_id) {
        const userInfo = await this.knex('users').where({ id: user_id }).first();
        if (!userInfo) {
            throw new common_1.HttpException('User does not exist', common_1.HttpStatus.NOT_FOUND);
        }
        return (0, class_transformer_1.plainToClass)(user_entity_1.UserEntity, userInfo);
    }
    async updateUser(user_id, uptUser) {
        const userInfo = await this.knex('users').where({ id: user_id }).first();
        if (!userInfo) {
            throw new common_1.HttpException('User does not exist', common_1.HttpStatus.NOT_FOUND);
        }
        if (Object.keys(uptUser).length != 0) {
            await this.knex('users').where('id', user_id).update(uptUser);
        }
        const updatedUser = await this.knex('users').where({ id: user_id }).first();
        return (0, class_transformer_1.plainToClass)(user_entity_1.UserEntity, updatedUser);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('KNEX_CONNECTION')),
    __metadata("design:paramtypes", [Function])
], UsersService);
//# sourceMappingURL=users.service.js.map