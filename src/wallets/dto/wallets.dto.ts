import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class FundAccountDto {
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
