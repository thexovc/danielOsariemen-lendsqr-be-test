import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { knexProvider } from '../knex/knex.provider';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, knexProvider],
})
export class WalletModule {}
