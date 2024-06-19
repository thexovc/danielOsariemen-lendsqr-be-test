export declare class GetWalletDto {
    currency: 'NGN' | 'EUR' | 'USD';
}
export declare class CreateWalletDto {
    currency: 'NGN' | 'EUR' | 'USD';
}
export declare class FundAccountDto {
    amount: number;
    currency: 'NGN' | 'EUR' | 'USD';
}
export declare class TransferFundsDto {
    currency: 'NGN' | 'EUR' | 'USD';
    recipient_email: string;
    amount: number;
}
export declare class WithdrawFundsDto {
    amount: number;
    currency: 'NGN' | 'EUR' | 'USD';
}
