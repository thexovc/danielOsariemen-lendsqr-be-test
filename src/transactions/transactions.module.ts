import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { knexProvider } from 'src/knex/knex.provider';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, knexProvider],
})
export class TransactionsModule {}
