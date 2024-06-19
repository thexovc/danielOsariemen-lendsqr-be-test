import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUser(req: any): Promise<import("./entities/user.entity").UserEntity>;
    updateUser(req: any, bodyData: UpdateUserDto): Promise<import("./entities/user.entity").UserEntity>;
}
