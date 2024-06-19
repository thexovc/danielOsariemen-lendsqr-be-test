import { Knex } from 'knex';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private readonly knex;
    constructor(knex: Knex);
    getUser(user_id: number): Promise<any>;
    updateUser(user_id: number, uptUser: UpdateUserDto): Promise<any>;
}
