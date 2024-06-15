import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import {
  FundAccountDto,
  TransferFundsDto,
  WithdrawFundsDto,
} from './dto/wallets.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('v1/wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getWallet(@Request() req) {
    return this.walletsService.getWallet(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Request() req) {
    return this.walletsService.createWallet(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Post('fund')
  async fundAccount(
    @Request() req,
    @Body(new ValidationPipe()) fundAccountDto: FundAccountDto,
  ) {
    return this.walletsService.fundAccount(req.user.id, fundAccountDto.amount);
  }

  @UseGuards(AuthGuard)
  @Post('transfer')
  async transferFunds(
    @Request() req,
    @Body() transferFundsDto: TransferFundsDto,
  ) {
    return this.walletsService.transferFunds(
      req.user.id,
      transferFundsDto.amount,
      transferFundsDto.recipient_email,
    );
  }

  @Post('withdraw')
  async withdrawFunds(
    @Request() req,
    @Body() withdrawFundsDto: WithdrawFundsDto,
  ) {
    return this.walletsService.withdrawFunds(
      req.user.id,
      withdrawFundsDto.amount,
    );
  }
}
