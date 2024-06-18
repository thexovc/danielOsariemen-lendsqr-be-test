import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('WalletsController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/wallet (GET) should return user wallet details', async () => {
    const userId = 1;
    const currency = 'NGN';

    const response = await request(app.getHttpServer())
      .get(`/v1/wallet?currency=${currency}`)
      .set('Accept', 'application/json')
      .set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0`,
      )
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.user_id).toBe(userId);
    expect(response.body.currency).toBe(currency);
  });

  it('/v1/wallet/create (POST) should create a new wallet', async () => {
    const createWalletDto = { currency: 'NGN' };

    const response = await request(app.getHttpServer())
      .post('/v1/wallet/create')
      .send(createWalletDto)
      .set('Accept', 'application/json')
      .set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0`,
      )
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.user_id).toBeDefined();
    expect(response.body.currency).toBe(createWalletDto.currency);
  });

  it('/v1/wallet/fund (POST) should fund the user account successfully', async () => {
    const fundAccountDto = { amount: 100, currency: 'NGN' };

    const response = await request(app.getHttpServer())
      .post('/v1/wallet/fund')
      .send(fundAccountDto)
      .set('Accept', 'application/json')
      .set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0`,
      )
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.user_id).toBeDefined();
    expect(response.body.balance).toBe(100);
    expect(response.body.currency).toBe(fundAccountDto.currency);
  });

  it('/v1/wallet/transfer (POST) should not transfer funds to account without wallet', async () => {
    const transferFundsDto = {
      amount: 50,
      currency: 'NGN',
      recipient_email: 'recipient@example.com',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/wallet/transfer')
      .send(transferFundsDto)
      .set('Accept', 'application/json')
      .set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0`,
      )
      .expect(404);

    expect(response.body).toHaveProperty('id');
    expect(response.body.wallet_id).toBeDefined();
    expect(response.body.amount).toBe(-50);
    expect(response.body.currency).toBe(transferFundsDto.currency);
  });

  it('/v1/wallet/withdraw (POST) should withdraw funds successfully', async () => {
    const withdrawFundsDto = { amount: 30, currency: 'NGN' };

    const response = await request(app.getHttpServer())
      .post('/v1/wallet/withdraw')
      .send(withdrawFundsDto)
      .set('Accept', 'application/json')
      .set(
        'Authorization',
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJvc2F6ZWVAZ21haWwuY29tIiwiZmlyc3RfbmFtZSI6IkRhbmllbCIsImxhc3RfbmFtZSI6IlBldGVyIiwicGFzc3dvcmQiOiIkMmEkMTAkSFNIVmZzZDBuS3hwaTV0WGFQSE9JT0dwbXJjWXdYSUkvYmRZUlNyUWEuLlY5cjhvbFJGTEMiLCJwaG9uZV9udW1iZXIiOiIxMjMtNDU2LTc4OTAiLCJjcmVhdGVkX2F0IjoiMjAyNC0wNi0xOFQxMDoyNjo1NC4wMDBaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDYtMThUMTA6MjY6NTQuMDAwWiIsImlhdCI6MTcxODc0NDI2NCwiZXhwIjoxNzE4NzYyMjY0fQ.arLAnYZcYKfXWeOqyTc6WEJbEtAekuU2bh-Avsmp_e0`,
      )
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.user_id).toBeDefined();
    expect(response.body.balance).toBe(30);
    expect(response.body.currency).toBe(withdrawFundsDto.currency);
  });
});
