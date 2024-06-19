import { Expose } from 'class-transformer';

@Expose()
export class TransactionEntity {
  id: number;
  wallet_id: number;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  currency: 'NGN' | 'EUR' | 'USD';
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }
}
