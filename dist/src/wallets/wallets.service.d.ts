import { Knex } from 'knex';
import { CreateWalletDto, FundAccountDto, GetWalletDto, TransferFundsDto, WithdrawFundsDto } from './dto/wallets.dto';
import { WalletEntity } from './entity/wallet.entity';
import { TransactionEntity } from 'src/transactions/entity/transactions.entity';
export declare class WalletsService {
    private readonly knex;
    constructor(knex: Knex);
    getWallet(user_id: number, getData: GetWalletDto): Promise<any>;
    createWallet(user_id: number, createWalletDto: CreateWalletDto): Promise<WalletEntity>;
    fundAccount(user_id: number, updateWalletDto: FundAccountDto): Promise<WalletEntity>;
    transferFunds(userId: number, transferData: TransferFundsDto): Promise<TransactionEntity>;
    withdraw(userId: number, withdrawalDto: WithdrawFundsDto): Promise<TransactionEntity>;
}
