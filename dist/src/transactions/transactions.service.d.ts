import { Knex } from 'knex';
export declare class TransactionsService {
    private readonly knex;
    constructor(knex: Knex);
    getTransactionById(userId: number, transactionId: number): Promise<any>;
    getAllTransactionsByUserIdAndCurrency(userId: number, currency?: 'NGN' | 'EUR' | 'USD', limit?: number, page?: number): Promise<{
        transactions: any[];
        total: string | number;
        limit: number;
        page: number;
    }>;
}
