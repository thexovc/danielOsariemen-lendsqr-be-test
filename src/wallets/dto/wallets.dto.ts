import { IsNotEmpty, IsString, IsNumber, Min, IsEnum } from 'class-validator';

export class CreateWalletDto {
  @IsEnum(['NGN', 'EUR', 'USD'])
  @IsNotEmpty()
  currency: 'NGN' | 'EUR' | 'USD';
}

export class FundAccountDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
}

export class TransferFundsDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsString()
  recipient_email: string;
}

export class WithdrawFundsDto {
  @IsNumber()
  @Min(0)
  amount: number;
}
