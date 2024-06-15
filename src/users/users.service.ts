import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  async getUser(user_id: number): Promise<any> {
    const userInfo = await this.knex('users').where({ id: user_id }).first();

    if (!userInfo) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return userInfo;
  }

  async updateUser(user_id: number, uptUser: UpdateUserDto): Promise<any> {
    const userInfo = await this.knex('users').where({ id: user_id }).first();

    if (!userInfo) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (Object.keys(uptUser).length != 0) {
      await this.knex('users').where('id', user_id).update(uptUser); // Updated the correct table
    }

    return await this.knex('users').where({ id: user_id }).first();
  }
}
