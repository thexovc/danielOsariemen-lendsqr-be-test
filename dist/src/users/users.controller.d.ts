import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUser(req: any): Promise<any>;
    updateUser(req: any, bodyData: UpdateUserDto): Promise<any>;
}
