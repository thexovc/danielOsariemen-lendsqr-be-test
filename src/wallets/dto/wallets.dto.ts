import { IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';

export class GetWalletDto {
  @IsEnum(['NGN', 'EUR', 'USD'], {
    message:
      "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
  })
  @IsNotEmpty()
  currency: 'NGN' | 'EUR' | 'USD';
}
export class CreateWalletDto {
  @IsEnum(['NGN', 'EUR', 'USD'], {
    message:
      "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
  })
  @IsNotEmpty()
  currency: 'NGN' | 'EUR' | 'USD';
}

export class FundAccountDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(['NGN', 'EUR', 'USD'], {
    message:
      "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
  })
  @IsNotEmpty()
  currency: 'NGN' | 'EUR' | 'USD';
}

export class TransferFundsDto {
  @IsNotEmpty()
  @IsEnum(['NGN', 'EUR', 'USD'], {
    message:
      "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
  })
  currency: 'NGN' | 'EUR' | 'USD';

  @IsNotEmpty()
  recipient_email: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;
}

export class WithdrawFundsDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsEnum(['NGN', 'EUR', 'USD'], {
    message:
      "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
  })
  currency: 'NGN' | 'EUR' | 'USD';
}
