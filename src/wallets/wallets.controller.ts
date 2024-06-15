import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { FundAccountDto, TransferFundsDto } from './dto/wallets.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('v1/wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(AuthGuard)
  @Post('fund')
  async fundAccount(
    @Request() req,
    @Body(new ValidationPipe()) fundAccountDto: FundAccountDto,
  ) {
    return this.walletsService.fundAccount(req.user.id, fundAccountDto.amount);
  }

  //   @Post(':userId/transfer')
  //   async transferFunds(@Body() transferFundsDto: TransferFundsDto) {
  //     return this.walletsService.transferFunds(
  //       userId,
  //       transferFundsDto.amount,
  //       transferFundsDto.recipient_email,
  //     );
  //   }

  //   @Post(':userId/withdraw')
  //   async withdrawFunds(@Body() withdrawFundsDto: WithdrawFundsDto) {
  //     return this.walletsService.withdrawFunds(userId, withdrawFundsDto.amount);
  //   }
}
