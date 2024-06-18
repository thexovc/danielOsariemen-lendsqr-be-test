import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { jwtConstants } from '../constants';

jest.mock('supertest');

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test', // Ensure you have a test environment file
        }),
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '5h' },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user successfully', async () => {
    const userDto = {
      email: 'testuser@example.com',
      password: 'password',
      first_name: 'John',
      last_name: 'Doe',
    };

    // Mock response for successful registration
    request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(userDto)
      .expect(HttpStatus.CREATED)
      .expect((response) => {
        expect(response.body).toMatchObject({
          message: 'registration successful!',
          user: {
            email: userDto.email,
            first_name: userDto.first_name,
            last_name: userDto.last_name,
          },
        });
      });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(userDto);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.message).toBe('registration successful!');
    expect(response.body.user.email).toBe(userDto.email);
  });

  it('should not register a user if email already exists', async () => {
    const existingUser = {
      email: 'testuser@example.com',
      password: 'password',
      first_name: 'Existing',
      last_name: 'User',
    };

    // Mock response for registration with existing email
    request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(existingUser)
      .expect(HttpStatus.BAD_REQUEST)
      .expect((response) => {
        expect(response.body).toMatchObject({
            message: 'Email already exists',
        });
      });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send(existingUser);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('Email already exists');
  });

  it('should login a user successfully', async () => {
    const loginDto = {
      email: 'testuser@example.com',
      password: 'password',
    };

    // Mock response for successful login
    request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(loginDto)
      .expect(HttpStatus.OK)
      .expect((response) => {
        expect(response.body).toMatchObject({
         
            email: loginDto.email,
        }),
      });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(loginDto);

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body.access_token).toBeDefined();
    expect(response.body.data.email).toBe(loginDto.email);
  });

  it('should not login a user with incorrect email', async () => {
    const loginDto = {
      email: 'nonexistentuser@example.com',
      password: 'password',
    };

    // Mock response for login with incorrect email
    (request as jest.Mocked<typeof request>)
      .post('/v1/auth/login')
      .send(loginDto)
      .expect(HttpStatus.NOT_FOUND)
      .mockResolvedValue({
        status: HttpStatus.NOT_FOUND,
        body: {
          message: 'Email is invalid',
        },
      });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(loginDto);

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(response.body.message).toBe('Email is invalid');
  });

  it('should not login a user with incorrect password', async () => {
    const loginDto = {
      email: 'testuser@example.com',
      password: 'wrongpassword',
    };

    // Mock response for login with incorrect password
    (request as jest.Mocked<typeof request>)
      .post('/v1/auth/login')
      .send(loginDto)
      .expect(HttpStatus.UNAUTHORIZED)
      .mockResolvedValue({
        status: HttpStatus.UNAUTHORIZED,
        body: {
          message: 'password incorrect',
        },
      });

    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(loginDto);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(response.body.message).toBe('password incorrect');
  });
});
