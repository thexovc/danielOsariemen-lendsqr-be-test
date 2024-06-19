import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { Knex } from 'knex';

describe('WalletsService', () => {
  let service: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
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

    service = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
