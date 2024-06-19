import { WalletsService } from './wallets.service';
import { CreateWalletDto, FundAccountDto, GetWalletDto, TransferFundsDto, WithdrawFundsDto } from './dto/wallets.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    getWallet(req: any, queryData: GetWalletDto): Promise<any>;
    createWallet(req: any, bodyData: CreateWalletDto): Promise<import("./entity/wallet.entity").WalletEntity>;
    fundAccount(req: any, fundAccountDto: FundAccountDto): Promise<import("./entity/wallet.entity").WalletEntity>;
    transferFunds(req: any, transferFundsDto: TransferFundsDto): Promise<import("../transactions/entity/transactions.entity").TransactionEntity>;
    withdrawFunds(req: any, withdrawFundsDto: WithdrawFundsDto): Promise<import("../transactions/entity/transactions.entity").TransactionEntity>;
}
