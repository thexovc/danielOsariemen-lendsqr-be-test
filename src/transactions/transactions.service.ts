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

  // async getAllTransactionsByUserId(
  //   userId: number,
  //   limit: number = 10,
  //   page: number = 1,
  // ) {
  //   const offset = (page - 1) * limit;

  //   // Fetch transactions for the given user ID with pagination
  //   const transactions = await this.knex('transactions as t')
  //     .select(
  //       't.id',
  //       't.amount',
  //       't.type',
  //       't.currency',
  //       't.created_at',
  //       't.updated_at',
  //     )
  //     .join('wallets as w', 't.wallet_id', 'w.id')
  //     .where('w.user_id', userId)
  //     .limit(limit)
  //     .offset(offset);

  //   // Count total number of transactions for the user
  //   const total = await this.knex('transactions as t')
  //     .join('wallets as w', 't.wallet_id', 'w.id')
  //     .where('w.user_id', userId)
  //     .count('* as total')
  //     .first();

  //   return {
  //     transactions,
  //     total: total.total, // Extract the total count from the query result
  //     limit,
  //     page,
  //   };
  // }

  async getAllTransactionsByUserIdAndCurrency(
    userId: number,
    currency?: 'NGN' | 'EUR' | 'USD',
    limit: number = 10,
    page: number = 1,
  ) {
    const offset = (page - 1) * limit;

    // Start building the query
    let query = this.knex('transactions as t')
      .select(
        't.id',
        't.amount',
        't.type',
        't.currency',
        't.created_at',
        't.updated_at',
      )
      .join('wallets as w', 't.wallet_id', 'w.id')
      .where('w.user_id', userId);

    // Add currency filter if provided
    if (currency) {
      query = query.where('t.currency', currency);
    }

    // Add pagination
    query = query.limit(limit).offset(offset);

    // Execute query to fetch transactions
    const transactions = await query;

    // Count total number of transactions for the user and currency (if filtered)
    let totalQuery = this.knex('transactions as t')
      .join('wallets as w', 't.wallet_id', 'w.id')
      .where('w.user_id', userId);

    // Add currency filter to total query if provided
    if (currency) {
      totalQuery = totalQuery.where('t.currency', currency);
    }

    const total = await totalQuery.count('* as total').first();

    return {
      transactions,
      total: total.total, // Extract the total count from the query result
      limit,
      page,
    };
  }
}
