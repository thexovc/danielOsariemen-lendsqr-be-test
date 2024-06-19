import { TransactionsService } from './transactions.service';
import { GetTransactionsDto } from './dto/transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    getTransactionById(req: any, transactionId: any): Promise<any>;
    getAllTransactionsByUserId(req: any, dto: GetTransactionsDto): Promise<{
        transactions: any[];
        total: string | number;
        limit: number;
        page: number;
    }>;
}
