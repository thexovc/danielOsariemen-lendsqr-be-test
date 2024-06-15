import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class WalletsService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  async fundAccount(user_id: number, amount: number) {
    const wallet = await this.knex('wallets').where({ user_id }).first();

    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    const newBalance = wallet.balance + amount;

    console.log({ newBalance });

    const trx = await this.knex.transaction(async (trx) => {
      await trx('wallets').where({ user_id }).update({ balance: newBalance });

      await trx('transactions').insert({
        wallet_id: wallet.id,
        amount,
        type: 'deposit',
      });
    });

    console.log({ trx });

    return { balance: newBalance };
  }
}
