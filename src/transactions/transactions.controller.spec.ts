import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '../guard/auth.guard';
import { GetTransactionsDto } from './dto/transaction.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    getTransactionById: jest.fn(),
    getAllTransactionsByUserIdAndCurrency: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTransactionById', () => {
    it('should call TransactionsService.getTransactionById with the correct parameters', async () => {
      const req = { user: { id: 1 } };
      const transactionId = 1;
      const result = {
        id: 1,
        wallet_id: 1,
        user_id: 1,
        amount: 3000,
        type: 'deposit',
        currency: 'NGN',
        created_at: '2024-06-16T13:32:53.000Z',
        updated_at: '2024-06-16T13:32:53.000Z',
      };

      mockTransactionsService.getTransactionById.mockResolvedValue(result);

      expect(await controller.getTransactionById(req, transactionId)).toEqual(
        result,
      );
      expect(service.getTransactionById).toHaveBeenCalledWith(
        req.user.id,
        transactionId,
      );
    });
  });

  describe('getAllTransactionsByUserId', () => {
    it('should call TransactionsService.getAllTransactionsByUserIdAndCurrency with the correct parameters', async () => {
      const req = { user: { id: 1 } };
      const dto: GetTransactionsDto = { currency: 'USD', limit: 10, page: 1 };
      const result = { transactions: [], total: 0, limit: 10, page: 1 };

      mockTransactionsService.getAllTransactionsByUserIdAndCurrency.mockResolvedValue(
        result,
      );

      expect(await controller.getAllTransactionsByUserId(req, dto)).toEqual(
        result,
      );
      expect(
        service.getAllTransactionsByUserIdAndCurrency,
      ).toHaveBeenCalledWith(
        req.user.id,
        dto.currency,
        Number(dto.limit),
        Number(dto.page),
      );
    });
  });
});
