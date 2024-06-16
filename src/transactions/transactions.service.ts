import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  async getTransactionById(userId: number, transactionId: number) {
    const transaction = await this.knex('transactions')
      .where('user_id', userId)
      .andWhere('id', transactionId)
      .select('*')
      .first();

    if (!transaction) {
      const exstTrx = await this.knex('transactions')
        .where('id', transactionId)
        .select('*')
        .first();

      if (exstTrx) {
        throw new HttpException(
          'User must be owner of transaction',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    return transaction;
  }

  async getAllTransactionsByUserId(
    userId: number,
    limit: number,
    page: number,
  ) {
    const offset = (page - 1) * limit;

    const transactions = await this.knex('transactions')
      .where('user_id', userId)
      .select('*')
      .limit(limit)
      .offset(offset);

    return transactions;
  }
}
