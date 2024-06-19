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
exports.WalletsController = void 0;
const common_1 = require("@nestjs/common");
const wallets_service_1 = require("./wallets.service");
const wallets_dto_1 = require("./dto/wallets.dto");
const auth_guard_1 = require("../guard/auth.guard");
let WalletsController = class WalletsController {
    constructor(walletsService) {
        this.walletsService = walletsService;
    }
    async getWallet(req, queryData) {
        return this.walletsService.getWallet(req.user.id, queryData);
    }
    async createWallet(req, bodyData) {
        return this.walletsService.createWallet(req.user.id, bodyData);
    }
    async fundAccount(req, fundAccountDto) {
        return this.walletsService.fundAccount(req.user.id, fundAccountDto);
    }
    async transferFunds(req, transferFundsDto) {
        return this.walletsService.transferFunds(req.user.id, transferFundsDto);
    }
    async withdrawFunds(req, withdrawFundsDto) {
        return this.walletsService.withdraw(req.user.id, withdrawFundsDto);
    }
};
exports.WalletsController = WalletsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wallets_dto_1.GetWalletDto]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "getWallet", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wallets_dto_1.CreateWalletDto]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "createWallet", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('fund'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wallets_dto_1.FundAccountDto]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "fundAccount", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('transfer'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wallets_dto_1.TransferFundsDto]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "transferFunds", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('withdraw'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wallets_dto_1.WithdrawFundsDto]),
    __metadata("design:returntype", Promise)
], WalletsController.prototype, "withdrawFunds", null);
exports.WalletsController = WalletsController = __decorate([
    (0, common_1.Controller)('v1/wallet'),
    __metadata("design:paramtypes", [wallets_service_1.WalletsService])
], WalletsController);
//# sourceMappingURL=wallets.controller.js.map