import { Knex } from 'knex';
import { TransactionEntity } from './entity/transactions.entity';
export declare class TransactionsService {
    private readonly knex;
    constructor(knex: Knex);
    getTransactionById(userId: number, transactionId: number): Promise<TransactionEntity>;
    getAllTransactionsByUserIdAndCurrency(userId: number, currency?: 'NGN' | 'EUR' | 'USD', limit?: number, page?: number): Promise<{
        transactions: any[];
        total: string | number;
        limit: number;
        page: number;
    }>;
}
