import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../guard/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUser: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUser', () => {
    it('should return user details', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        phone_number: '1234567890',
      };
      jest.spyOn(usersService, 'getUser').mockResolvedValue(user);

      const req = { user: { id: 1 } };
      expect(await usersController.getUser(req)).toBe(user);
    });

    it('should throw an exception if user not found', async () => {
      jest
        .spyOn(usersService, 'getUser')
        .mockRejectedValue(
          new HttpException('User not found', HttpStatus.NOT_FOUND),
        );

      const req = { user: { id: 1 } };
      await expect(usersController.getUser(req)).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateUser', () => {
    it('should update user details successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
        last_name: 'User',
        phone_number: '0987654321',
      };
      const updatedUser = { id: 1, ...updateUserDto };
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);

      const req = { user: { id: 1 } };
      expect(await usersController.updateUser(req, updateUserDto)).toBe(
        updatedUser,
      );
    });

    it('should throw an exception if update fails', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
        last_name: 'User',
        phone_number: '0987654321',
      };
      jest
        .spyOn(usersService, 'updateUser')
        .mockRejectedValue(
          new HttpException('Update failed', HttpStatus.BAD_REQUEST),
        );

      const req = { user: { id: 1 } };
      await expect(
        usersController.updateUser(req, updateUserDto),
      ).rejects.toThrow(
        new HttpException('Update failed', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
