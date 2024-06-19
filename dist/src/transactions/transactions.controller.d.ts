import { TransactionsService } from './transactions.service';
import { GetTransactionsDto } from './dto/transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    getTransactionById(req: any, transactionId: any): Promise<import("./entity/transactions.entity").TransactionEntity>;
    getAllTransactionsByUserId(req: any, dto: GetTransactionsDto): Promise<{
        transactions: any[];
        total: string | number;
        limit: number;
        page: number;
    }>;
}
