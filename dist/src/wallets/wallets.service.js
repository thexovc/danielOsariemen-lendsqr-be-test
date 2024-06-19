"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
let WalletsService = class WalletsService {
    constructor(knex) {
        this.knex = knex;
    }
    async getWallet(user_id, getData) {
        const wallet = await this.knex('wallets')
            .where({ user_id, currency: getData.currency })
            .first();
        if (!wallet) {
            throw new common_1.HttpException('Wallet not found', common_1.HttpStatus.NOT_FOUND);
        }
        return wallet;
    }
    async createWallet(user_id, createWalletDto) {
        const existingWallet = await this.knex('wallets')
            .where({
            user_id,
            currency: createWalletDto.currency,
        })
            .first();
        if (existingWallet) {
            throw new common_1.HttpException('Wallet already exists for this currency', common_1.HttpStatus.BAD_REQUEST);
        }
        const [walletId] = await this.knex('wallets').insert({
            user_id,
            currency: createWalletDto.currency,
        });
        return await this.knex('wallets').where({ id: walletId }).first();
    }
    async fundAccount(user_id, updateWalletDto) {
        const wallet = await this.knex('wallets')
            .where({
            user_id,
            currency: updateWalletDto.currency,
        })
            .first();
        if (!wallet) {
            throw new common_1.HttpException('Wallet not found', common_1.HttpStatus.NOT_FOUND);
        }
        const newBalance = wallet.balance + updateWalletDto.amount;
        console.log({ newBalance });
        const newTransactions = await this.knex.transaction(async (trx) => {
            await trx('wallets')
                .where({ user_id, currency: updateWalletDto.currency })
                .update({ balance: newBalance });
            return await trx('transactions').insert({
                wallet_id: wallet.id,
                amount: updateWalletDto.amount,
                type: 'deposit',
                currency: updateWalletDto.currency,
            });
        });
        return await this.knex('wallets')
            .where({
            user_id,
            currency: updateWalletDto.currency,
        })
            .first();
    }
    async transferFunds(userId, transferData) {
        const senderWallet = await this.knex('wallets')
            .join('users', 'wallets.user_id', 'users.id')
            .where('users.id', userId)
            .andWhere('wallets.currency', transferData.currency)
            .select('wallets.id', 'wallets.balance')
            .first();
        if (!senderWallet) {
            throw new common_1.HttpException('Sender wallet not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (senderWallet.balance < transferData.amount) {
            throw new common_1.HttpException('Insufficient balance', common_1.HttpStatus.BAD_REQUEST);
        }
        const recipientWallet = await this.knex('wallets')
            .join('users', 'wallets.user_id', 'users.id')
            .where('users.email', transferData.recipient_email)
            .andWhere('wallets.currency', transferData.currency)
            .select('wallets.id', 'wallets.balance')
            .first();
        if (!recipientWallet) {
            throw new common_1.HttpException('Recipient wallet not found', common_1.HttpStatus.NOT_FOUND);
        }
        let senderTrxId = null;
        await this.knex.transaction(async (trx) => {
            const updatedSender = await trx('wallets')
                .where({ id: senderWallet.id })
                .update({ balance: senderWallet.balance - transferData.amount });
            const updatedRecipient = await trx('wallets')
                .where({ id: recipientWallet.id })
                .update({ balance: recipientWallet.balance + transferData.amount });
            if (!updatedSender || !updatedRecipient) {
                throw new common_1.HttpException('Failed to update wallets', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            const [senderTransactionId] = await trx('transactions')
                .insert({
                wallet_id: senderWallet.id,
                amount: -transferData.amount,
                type: 'transfer',
                currency: transferData.currency,
            })
                .returning('id');
            senderTrxId = senderTransactionId;
            const recipientTransaction = await trx('transactions').insert({
                wallet_id: recipientWallet.id,
                amount: transferData.amount,
                type: 'deposit',
                currency: transferData.currency,
            });
            if (!senderTransactionId || !recipientTransaction) {
                throw new common_1.HttpException('Failed to record transactions', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
        const sendTransac = await this.knex('transactions')
            .where('id', senderTrxId)
            .first();
        return sendTransac;
    }
    async withdraw(userId, withdrawalDto) {
        const { amount, currency } = withdrawalDto;
        const wallet = await this.knex('wallets')
            .where({ user_id: userId, currency })
            .first();
        if (!wallet) {
            throw new common_1.HttpException('Wallet not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (wallet.balance < amount) {
            throw new common_1.HttpException('Insufficient balance', common_1.HttpStatus.BAD_REQUEST);
        }
        const updatedWallet = await this.knex.transaction(async (trx) => {
            await trx('wallets')
                .where({ id: wallet.id })
                .update({ balance: wallet.balance - amount });
            const newTrx = await trx('transactions').insert({
                wallet_id: wallet.id,
                amount: -amount,
                type: 'withdrawal',
                currency: currency,
            });
            console.log({ newTrx });
            return trx('transactions').where({ id: newTrx[0] }).first();
        });
        return updatedWallet;
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('KNEX_CONNECTION')),
    __metadata("design:paramtypes", [Function])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map