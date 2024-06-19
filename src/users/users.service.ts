import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { plainToClass } from 'class-transformer';

import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  async getUser(user_id: number): Promise<UserEntity> {
    const userInfo = await this.knex('users').where({ id: user_id }).first();

    if (!userInfo) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return plainToClass(UserEntity, userInfo);
  }

  async updateUser(
    user_id: number,
    uptUser: UpdateUserDto,
  ): Promise<UserEntity> {
    const userInfo = await this.knex('users').where({ id: user_id }).first();

    if (!userInfo) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (Object.keys(uptUser).length != 0) {
      await this.knex('users').where('id', user_id).update(uptUser);
    }

    const updatedUser = await this.knex('users').where({ id: user_id }).first();
    return plainToClass(UserEntity, updatedUser);
  }
}
