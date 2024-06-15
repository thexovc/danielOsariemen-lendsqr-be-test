import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class WalletsService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  async getWallet(user_id: number): Promise<any> {
    const wallet = await this.knex('wallets').where({ user_id: 8 }).first();

    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    return wallet;
  }

  async createWallet(user_id: number): Promise<any> {
    const existingWallet = await this.knex('wallets')
      .where({ user_id })
      .first();

    if (existingWallet) {
      throw new HttpException('Wallet already created', HttpStatus.CONFLICT);
    }

    await this.knex('wallets')
      .insert({
        user_id,
        currency: 'NGN',
        balance: 0, // Default balance
      })
      .returning('id'); // 'returning' ensures the ID is returned

    const walletInfo = await this.knex('wallets').where({ user_id }).first();

    return walletInfo;
  }

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

  async transferFunds(userId: number, amount: number, recipientEmail: string) {
    const senderWallet = await this.knex('wallets')
      .join('users', 'wallets.user_id', 'users.id')
      .where('users.id', userId)
      .first();
    if (!senderWallet) {
      throw new HttpException('Sender wallet not found', HttpStatus.NOT_FOUND);
    }

    if (senderWallet.balance < amount) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    const recipientWallet = await this.knex('wallets')
      .join('users', 'wallets.user_id', 'users.id')
      .where('users.email', recipientEmail)
      .first();
    if (!recipientWallet) {
      throw new HttpException(
        'Recipient wallet not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.knex.transaction(async (trx) => {
      await trx('wallets')
        .where({ id: senderWallet.id })
        .update({ balance: senderWallet.balance - amount });
      await trx('wallets')
        .where({ id: recipientWallet.id })
        .update({ balance: recipientWallet.balance + amount });
      await trx('transactions').insert([
        { wallet_id: senderWallet.id, amount, type: 'transfer' },
        { wallet_id: recipientWallet.id, amount, type: 'deposit' },
      ]);
    });

    return { balance: senderWallet.balance - amount };
  }

  async withdrawFunds(userId: number, amount: number) {
    const wallet = await this.knex('wallets')
      .where({ user_id: userId })
      .first();
    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    if (wallet.balance < amount) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    const newBalance = wallet.balance - amount;
    await this.knex('wallets')
      .where({ user_id: userId })
      .update({ balance: newBalance });
    await this.knex('transactions').insert({
      wallet_id: wallet.id,
      amount,
      type: 'withdrawal',
    });

    return { balance: newBalance };
  }
}
