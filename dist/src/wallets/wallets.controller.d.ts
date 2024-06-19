import { WalletsService } from './wallets.service';
import { CreateWalletDto, FundAccountDto, GetWalletDto, TransferFundsDto, WithdrawFundsDto } from './dto/wallets.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    getWallet(req: any, queryData: GetWalletDto): Promise<any>;
    createWallet(req: any, bodyData: CreateWalletDto): Promise<any>;
    fundAccount(req: any, fundAccountDto: FundAccountDto): Promise<any>;
    transferFunds(req: any, transferFundsDto: TransferFundsDto): Promise<any>;
    withdrawFunds(req: any, withdrawFundsDto: WithdrawFundsDto): Promise<any>;
}
