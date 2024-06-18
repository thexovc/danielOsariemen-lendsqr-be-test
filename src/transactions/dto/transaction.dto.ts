import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetTransactionsDto {
  @IsOptional()
  @IsString()
  limit: number;

  @IsOptional()
  @IsString()
  page: number;

  @IsEnum(['NGN', 'EUR', 'USD'], {
    message:
      "currency must be one of the following values: 'NGN', 'EUR', 'USD' ",
  })
  @IsNotEmpty()
  currency: 'NGN' | 'EUR' | 'USD';
}
