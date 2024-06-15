import { Body, Controller, Post } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { FundAccountDto, TransferFundsDto } from './dto/wallets.dto';

@Controller('v1/wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post('fund')
  async fundAccount(@Body() fundAccountDto: FundAccountDto) {
    return this.walletsService.fundAccount(userId, fundAccountDto.amount);
  }

  @Post(':userId/transfer')
  async transferFunds(@Body() transferFundsDto: TransferFundsDto) {
    return this.walletsService.transferFunds(
      userId,
      transferFundsDto.amount,
      transferFundsDto.recipient_email,
    );
  }

  @Post(':userId/withdraw')
  async withdrawFunds(@Body() withdrawFundsDto: WithdrawFundsDto) {
    return this.walletsService.withdrawFunds(userId, withdrawFundsDto.amount);
  }
}
