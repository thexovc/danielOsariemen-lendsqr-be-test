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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawFundsDto = exports.TransferFundsDto = exports.FundAccountDto = exports.CreateWalletDto = exports.GetWalletDto = void 0;
const class_validator_1 = require("class-validator");
class GetWalletDto {
}
exports.GetWalletDto = GetWalletDto;
__decorate([
    (0, class_validator_1.IsEnum)(['NGN', 'EUR', 'USD'], {
        message: "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetWalletDto.prototype, "currency", void 0);
class CreateWalletDto {
}
exports.CreateWalletDto = CreateWalletDto;
__decorate([
    (0, class_validator_1.IsEnum)(['NGN', 'EUR', 'USD'], {
        message: "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWalletDto.prototype, "currency", void 0);
class FundAccountDto {
}
exports.FundAccountDto = FundAccountDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], FundAccountDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['NGN', 'EUR', 'USD'], {
        message: "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FundAccountDto.prototype, "currency", void 0);
class TransferFundsDto {
}
exports.TransferFundsDto = TransferFundsDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['NGN', 'EUR', 'USD'], {
        message: "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
    }),
    __metadata("design:type", String)
], TransferFundsDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TransferFundsDto.prototype, "recipient_email", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TransferFundsDto.prototype, "amount", void 0);
class WithdrawFundsDto {
}
exports.WithdrawFundsDto = WithdrawFundsDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], WithdrawFundsDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['NGN', 'EUR', 'USD'], {
        message: "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
    }),
    __metadata("design:type", String)
], WithdrawFundsDto.prototype, "currency", void 0);
//# sourceMappingURL=wallets.dto.js.map