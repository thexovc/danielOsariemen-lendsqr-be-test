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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
let TransactionsService = class TransactionsService {
    constructor(knex) {
        this.knex = knex;
    }
    async getTransactionById(userId, transactionId) {
        const transaction = await this.knex('transactions')
            .where('user_id', userId)
            .andWhere('id', transactionId)
            .select('*')
            .first();
        if (!transaction) {
            const exstTrx = await this.knex('transactions')
                .where('id', transactionId)
                .select('*')
                .first();
            if (exstTrx) {
                throw new common_1.HttpException('User must be owner of transaction', common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException('Transaction not found', common_1.HttpStatus.NOT_FOUND);
        }
        return transaction;
    }
    async getAllTransactionsByUserIdAndCurrency(userId, currency, limit = 10, page = 1) {
        const offset = (page - 1) * limit;
        let query = this.knex('transactions as t')
            .select('t.id', 't.amount', 't.type', 't.currency', 't.created_at', 't.updated_at')
            .join('wallets as w', 't.wallet_id', 'w.id')
            .where('w.user_id', userId);
        if (currency) {
            query = query.where('t.currency', currency);
        }
        query = query.limit(limit).offset(offset);
        const transactions = await query;
        let totalQuery = this.knex('transactions as t')
            .join('wallets as w', 't.wallet_id', 'w.id')
            .where('w.user_id', userId);
        if (currency) {
            totalQuery = totalQuery.where('t.currency', currency);
        }
        const total = await totalQuery.count('* as total').first();
        return {
            transactions,
            total: total.total,
            limit,
            page,
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('KNEX_CONNECTION')),
    __metadata("design:paramtypes", [Function])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map