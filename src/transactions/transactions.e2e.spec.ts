import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { TransactionsService } from './transactions.service';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;
  let transactionsService: TransactionsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    transactionsService =
      moduleFixture.get<TransactionsService>(TransactionsService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/v1/transactions/single/:transactionId (GET)', () => {
    it('should get a transaction by ID', async () => {
      const transactionId = '1';
      const expectedResult = {
        id: 1,
        wallet_id: 1,
        user_id: 1,
        amount: 3000,
        type: 'deposit',
        currency: 'NGN',
        created_at: '2024-06-16T13:32:53.000Z',
        updated_at: '2024-06-16T13:32:53.000Z',
      };

      jest
        .spyOn(transactionsService, 'getTransactionById')
        .mockResolvedValue(expectedResult);

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0'; // Replace with actual token logic

      await request(app.getHttpServer())
        .get(`/v1/transactions/single/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(expectedResult);
        });
    });
  });

  describe('/v1/transactions/user (GET)', () => {
    it('should get all transactions for a user', async () => {
      const expectedResult = {
        transactions: [],
        total: 0,
        limit: 10,
        page: 1,
      };

      jest
        .spyOn(transactionsService, 'getAllTransactionsByUserIdAndCurrency')
        .mockResolvedValue(expectedResult);

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0'; // Replace with actual token logic

      const queryParams = {
        currency: 'USD',
        limit: '10',
        page: '1',
      };

      await request(app.getHttpServer())
        .get('/v1/transactions/user')
        .query(queryParams)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual(expectedResult);
        });
    });
  });
});
