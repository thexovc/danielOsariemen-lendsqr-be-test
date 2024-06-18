import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module'; // Adjust path as necessary
import { AuthService } from '../auth/auth.service';
import { RegisterDto, loginDto } from '../auth/dto/auth.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a user successfully', async () => {
      const registerDto: RegisterDto = {
        first_name: 'test1',
        last_name: 'test2',
        email: 'test@example.com',
        password: 'password',
        phone_number: '',
      };

      jest.spyOn(authService, 'register').mockResolvedValue({
        message: 'User registered successfully',
        user: { id: 1 },
      });

      await request(app.getHttpServer())
        .post('/v1/auth/register') // Adjust this path if necessary
        .send(registerDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.message).toBe('User registered successfully');
          expect(res.body.user.id).toBe(1);
        });
    });

    it('should return a 403 if email is in Karma Blacklist', async () => {
      const registerDto: RegisterDto = {
        first_name: 'test1',
        last_name: 'test2',
        email: 'blacklisted@example.com',
        password: 'password',
        phone_number: '',
      };

      jest.spyOn(authService, 'register').mockResolvedValue({
        error: true,
        message: 'Email In Karma Blacklist',
      });

      await request(app.getHttpServer())
        .post('/v1/auth/register') // Adjust this path if necessary
        .send(registerDto)
        .expect(HttpStatus.FORBIDDEN)
        .expect((res) => {
          expect(res.body.message).toBe('Email In Karma Blacklist');
        });
    });

    it('should return a 500 for unexpected errors', async () => {
      const registerDto: RegisterDto = {
        first_name: 'test1',
        last_name: 'test2',
        email: 'error@example.com',
        password: 'password',
        phone_number: '',
      };

      jest
        .spyOn(authService, 'register')
        .mockRejectedValue(new Error('Unexpected error'));

      await request(app.getHttpServer())
        .post('/v1/auth/register') // Adjust this path if necessary
        .send(registerDto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect((res) => {
          expect(res.body.message).toBe('Internal server error');
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login a user successfully', async () => {
      const loginDto: loginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'login').mockResolvedValue({
        access_token: 'jwt-token',
        data: {
          first_name: 'test1',
          last_name: 'test2',
          email: 'test@example.com',
          password: 'password',
          phone_number: '',
          created_at: '2024-06-18T14:35:36.000Z',
          updated_at: '2024-06-18T14:35:36.000Z',
        },
      });

      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send(loginDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.access_token).toBe('jwt-token');
          expect(res.body.data).toStrictEqual({
            first_name: 'test1',
            last_name: 'test2',
            email: 'test@example.com',
            password: 'password',
            phone_number: '',
            created_at: '2024-06-18T14:35:36.000Z',
            updated_at: '2024-06-18T14:35:36.000Z',
          });
        });
    });

    it('should return a 500 for unexpected errors during login', async () => {
      const loginDto: loginDto = {
        email: 'error@example.com',
        password: 'password',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Unexpected error'));

      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send(loginDto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect((res) => {
          expect(res.body.message).toBe('Internal server error');
        });
    });
  });
});
