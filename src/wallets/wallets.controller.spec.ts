import { Test, TestingModule } from '@nestjs/testing';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '../guard/auth.guard';
import {
  CreateWalletDto,
  FundAccountDto,
  GetWalletDto,
  TransferFundsDto,
  WithdrawFundsDto,
} from './dto/wallets.dto';
import { BadRequestException, HttpException } from '@nestjs/common';
import { TransactionEntity } from 'src/transactions/entity/transactions.entity';
import { WalletEntity } from './entity/wallet.entity';

describe('WalletsController', () => {
  let controller: WalletsController;
  let walletsService: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useValue: {
            getWallet: jest.fn(),
            createWallet: jest.fn(),
            fundAccount: jest.fn(),
            transferFunds: jest.fn(),
            withdraw: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<WalletsController>(WalletsController);
    walletsService = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // getWallet
  describe('getWallet', () => {
    it('shoud return user wallet details', async () => {
      const userId = 1;
      const queryData: GetWalletDto = { currency: 'NGN' };

      const expectedResult = {
        id: 1,
        user_id: 1,
        balance: 0,
        currency: 'NGN',
        created_at: '2024-06-15T20:59:12.000Z',
        updated_at: '2024-06-15T20:59:12.000Z',
      };

      jest.spyOn(walletsService, 'getWallet').mockResolvedValue(expectedResult);

      const req = { user: { id: userId } };
      const result = await controller.getWallet(req, queryData);

      expect(result).toBe(expectedResult);
      expect(walletsService.getWallet).toHaveBeenCalledWith(userId, queryData);
    });
  });

  // create
  describe('create', () => {
    it('should create a new wallet', async () => {
      const userId = 1;
      const createWalletDto: CreateWalletDto = { currency: 'NGN' };

      const expectedResult: WalletEntity = {
        id: 1,
        user_id: 1,
        balance: 0,
        currency: 'NGN',
        created_at: undefined,
        updated_at: undefined,
      };
      jest
        .spyOn(walletsService, 'createWallet')
        .mockResolvedValue(expectedResult);

      const req = { user: { id: userId } };
      const result = await controller.createWallet(req, createWalletDto);

      expect(result).toBe(expectedResult);
      expect(walletsService.createWallet).toHaveBeenCalledWith(
        userId,
        createWalletDto,
      );
    });
  });

  // fundAccount
  describe('fundAccount', () => {
    it('should fund the user account successfully', async () => {
      const userId = 1;
      const fundAccountDto: FundAccountDto = { amount: 100, currency: 'NGN' };

      const expectedResult: WalletEntity = {
        id: 3,
        user_id: 0,
        balance: 100,
        currency: 'NGN',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(walletsService, 'fundAccount')
        .mockResolvedValue(expectedResult);

      const req = { user: { id: userId } };
      const result = await controller.fundAccount(req, fundAccountDto);

      expect(result).toBe(expectedResult);
      expect(walletsService.fundAccount).toHaveBeenCalledWith(
        userId,
        fundAccountDto,
      );
    });

    it('should throw HttpException if fundAccountDto validation fails', async () => {
      const req = { user: { id: 1 } };
      const invalidDto: FundAccountDto = { amount: -10, currency: 'NGN' };

      try {
        await controller.fundAccount(req, invalidDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(400);
      }
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds successfully', async () => {
      const userId = 1;
      const transferFundsDto: TransferFundsDto = {
        amount: 50,
        currency: 'NGN',
        recipient_email: 'recipient@example.com',
      };

      const expectedResult: TransactionEntity = {
        id: 1,
        wallet_id: 1,
        amount: 50,
        type: 'deposit',
        currency: 'NGN',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(walletsService, 'transferFunds')
        .mockResolvedValue(expectedResult);

      const req = { user: { id: userId } };
      const result = await controller.transferFunds(req, transferFundsDto);

      expect(result).toBe(expectedResult);
      expect(walletsService.transferFunds).toHaveBeenCalledWith(
        userId,
        transferFundsDto,
      );
    });

    it('should throw BadRequestException if transferFundsDto validation fails', async () => {
      const req = { user: { id: 1 } };
      const invalidDto: TransferFundsDto = {
        amount: -50,
        currency: 'NGN',
        recipient_email: 'recipient@example.com',
      };

      try {
        await controller.transferFunds(req, invalidDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toBe(400);
      }
    });
  });

  describe('withdrawFunds', () => {
    it('should withdraw funds successfully', async () => {
      const userId = 1;
      const withdrawFundsDto: WithdrawFundsDto = {
        amount: 30,
        currency: 'NGN',
      };

      const expectedResult: TransactionEntity = {
        id: 1,
        currency: 'NGN',
        wallet_id: 1,
        amount: 30,
        type: 'withdrawal',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(walletsService, 'withdraw').mockResolvedValue(expectedResult);

      const req = { user: { id: userId } };
      const result = await controller.withdrawFunds(req, withdrawFundsDto);

      expect(result).toBe(expectedResult);
      expect(walletsService.withdraw).toHaveBeenCalledWith(
        userId,
        withdrawFundsDto,
      );
    });

    it('should throw BadRequestException if withdrawFundsDto validation fails', async () => {
      const req = { user: { id: 1 } };
      const invalidDto: WithdrawFundsDto = { amount: -30, currency: 'NGN' };

      try {
        await controller.withdrawFunds(req, invalidDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getStatus()).toBe(400);
      }
    });
  });
});
