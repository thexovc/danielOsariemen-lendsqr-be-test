import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { TransactionEntity } from './entity/transactions.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  async getTransactionById(
    userId: number,
    transactionId: number,
  ): Promise<TransactionEntity> {
    try {
      // Check if the transaction exists
      const exiTrx = await this.knex('transactions')
        .where('id', transactionId)
        .select('*')
        .first();

      if (!exiTrx) {
        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
      }

      const transaction = await this.knex('transactions')
        .join('wallets', 'transactions.wallet_id', 'wallets.id')
        .where({
          'transactions.id': transactionId,
          'wallets.user_id': userId,
        })
        .select('transactions.*')
        .first();

      if (!transaction) {
        throw new HttpException(
          'User must be owner of transaction',
          HttpStatus.NOT_FOUND,
        );
      }

      return plainToClass(TransactionEntity, transaction);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
