import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, loginDto } from './dto/auth.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const result = {
        message: 'User registered successfully',
        user: { id: 1 },
      };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      const registerDto: RegisterDto = {
        first_name: 'test1',
        last_name: 'test2',
        email: 'test@example.com',
        password: 'password',
        phone_number: '',
      };
      expect(await authController.register(registerDto)).toBe(result);
    });

    it('should throw a ForbiddenException if email is in Karma Blacklist', async () => {
      const result = { error: true, message: 'Email In Karma Blacklist' };
      jest.spyOn(authService, 'register').mockResolvedValue(result);

      const registerDto: RegisterDto = {
        first_name: 'test1',
        last_name: 'test2',
        email: 'blacklisted@example.com',
        password: 'password',
        phone_number: '',
      };
      await expect(authController.register(registerDto)).rejects.toThrow(
        new HttpException(result.message, HttpStatus.FORBIDDEN),
      );
    });

    it('should rethrow any other errors', async () => {
      const error = new Error('Unexpected error');
      jest.spyOn(authService, 'register').mockRejectedValue(error);

      const registerDto: RegisterDto = {
        first_name: 'test1',
        last_name: 'test2',
        email: 'error@example.com',
        password: 'password',
        phone_number: '',
      };
      await expect(authController.register(registerDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const result = { token: 'jwt-token' };
      jest.spyOn(authService, 'login').mockResolvedValue(result);

      const loginDto: loginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      expect(await authController.login(loginDto)).toBe(result);
    });

    it('should rethrow any errors during login', async () => {
      const error = new Error('Unexpected error');
      jest.spyOn(authService, 'login').mockRejectedValue(error);

      const loginDto: loginDto = {
        email: 'error@example.com',
        password: 'password',
      };
      await expect(authController.login(loginDto)).rejects.toThrow(error);
    });
  });
});
