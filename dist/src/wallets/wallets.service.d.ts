import { Knex } from 'knex';
import { CreateWalletDto, FundAccountDto, GetWalletDto, TransferFundsDto, WithdrawFundsDto } from './dto/wallets.dto';
export declare class WalletsService {
    private readonly knex;
    constructor(knex: Knex);
    getWallet(user_id: number, getData: GetWalletDto): Promise<any>;
    createWallet(user_id: number, createWalletDto: CreateWalletDto): Promise<any>;
    fundAccount(user_id: number, updateWalletDto: FundAccountDto): Promise<any>;
    transferFunds(userId: number, transferData: TransferFundsDto): Promise<any>;
    withdraw(userId: number, withdrawalDto: WithdrawFundsDto): Promise<any>;
}
