import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { GetTransactionsDto } from './dto/transaction.dto';

@Controller('v1/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @UseGuards(AuthGuard)
  @Get('single/:transactionId')
  async getTransactionById(
    @Request() req,
    @Param('transactionId') transactionId,
  ) {
    return this.transactionsService.getTransactionById(
      req.user.id,
      transactionId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAllTransactionsByUserId(
    @Request() req,
    @Query() dto: GetTransactionsDto,
  ) {
    return this.transactionsService.getAllTransactionsByUserId(
      req.user.id,
      dto.limit,
      dto.page,
    );
  }
}
