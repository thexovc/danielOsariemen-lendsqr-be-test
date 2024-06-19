import { AuthService } from './auth.service';
import { RegisterDto, loginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message?: string;
        error?: boolean;
        user?: any;
    }>;
    login(loginData: loginDto): Promise<any>;
}
