import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import {
  CreateWalletDto,
  FundAccountDto,
  GetWalletDto,
  TransferFundsDto,
  WithdrawFundsDto,
} from './dto/wallets.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('v1/wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getWallet(
    @Request() req,
    @Query(new ValidationPipe()) queryData: GetWalletDto,
  ) {
    return this.walletsService.getWallet(req.user.id, queryData);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async create(
    @Request() req,
    @Body(new ValidationPipe()) bodyData: CreateWalletDto,
  ) {
    return this.walletsService.createWallet(req.user.id, bodyData);
  }

  @UseGuards(AuthGuard)
  @Post('fund')
  async fundAccount(
    @Request() req,
    @Body(new ValidationPipe()) fundAccountDto: FundAccountDto,
  ) {
    return this.walletsService.fundAccount(req.user.id, fundAccountDto);
  }

  @UseGuards(AuthGuard)
  @Post('transfer')
  async transferFunds(
    @Request() req,
    @Body(new ValidationPipe()) transferFundsDto: TransferFundsDto,
  ) {
    return this.walletsService.transferFunds(req.user.id, transferFundsDto);
  }

  @UseGuards(AuthGuard)
  @Post('withdraw')
  async withdrawFunds(
    @Request() req,
    @Body(new ValidationPipe()) withdrawFundsDto: WithdrawFundsDto,
  ) {
    return this.walletsService.withdraw(req.user.id, withdrawFundsDto);
  }
}
