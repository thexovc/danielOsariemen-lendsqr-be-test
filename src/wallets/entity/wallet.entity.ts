import { Expose } from 'class-transformer';

@Expose()
export class WalletEntity {
  id: number;
  user_id: number;
  balance: number;
  currency: 'NGN' | 'EUR' | 'USD';
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<WalletEntity>) {
    Object.assign(this, partial);
  }
}
