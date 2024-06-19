export declare class WalletEntity {
    id: number;
    user_id: number;
    balance: number;
    currency: 'NGN' | 'EUR' | 'USD';
    created_at: Date;
    updated_at: Date;
    constructor(partial: Partial<WalletEntity>);
}
