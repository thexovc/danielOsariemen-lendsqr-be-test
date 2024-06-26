import { Knex } from 'knex';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private readonly knex;
    constructor(knex: Knex);
    getUser(user_id: number): Promise<UserEntity>;
    updateUser(user_id: number, uptUser: UpdateUserDto): Promise<UserEntity>;
}
