import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Knex } from 'knex';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: 'KNEX_CONNECTION',
          useValue: {
            select: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            first: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
