import { IsNumber, IsOptional } from 'class-validator';

export class GetTransactionsDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  page: number;
}
