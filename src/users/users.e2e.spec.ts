import { INestApplication, HttpStatus, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/v1/users (GET)', () => {
    it('should return user details', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        phone_number: '1234567890',
      };

      jest.spyOn(usersService, 'getUser').mockResolvedValue(user);

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0';

      await request(app.getHttpServer())
        .get('/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toStrictEqual(user);
        });
    });

    it('should throw an exception if jwt invalid for get user', async () => {
      jest.spyOn(usersService, 'getUser').mockResolvedValue(null);

      const token = 'some-invalid-jwt-token';

      await request(app.getHttpServer())
        .get('/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((res) => {
          expect(res.body.message).toBe('jwt malformed');
        });
    });
  });

  describe('/v1/users (PUT)', () => {
    it('should update user details successfully', async () => {
      const updateUserDto = {
        first_name: 'Updated',
        last_name: 'User',
        phone_number: '0987654321',
      };
      const updatedUser = { id: 1, ...updateUserDto };

      jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0';

      await request(app.getHttpServer())
        .put('/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(updateUserDto)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toStrictEqual(updatedUser);
        });
    });

    it('should throw an exception if update fails', async () => {
      const updateUserDto = {
        first_name: 'Updated',
        last_name: 'User',
        phone_number: '0987654321',
      };

      jest
        .spyOn(usersService, 'updateUser')
        .mockRejectedValue(
          new HttpException('Update failed', HttpStatus.BAD_REQUEST),
        );

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0';

      await request(app.getHttpServer())
        .put('/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(updateUserDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toBe('Update failed');
        });
    });
  });
});
