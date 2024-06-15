import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class WalletsService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  async getWallet(user_id: number): Promise<any> {
    const wallet = await this.knex('wallets').where({ user_id }).first();

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
      .select('wallets.id', 'wallets.balance')
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
      .select('wallets.id', 'wallets.balance')
      .first();
    if (!recipientWallet) {
      throw new HttpException(
        'Recipient wallet not found',
        HttpStatus.NOT_FOUND,
      );
    }

    let senderTrxId = null;

    await this.knex.transaction(async (trx) => {
      const updatedSender = await trx('wallets')
        .where({ id: senderWallet.id })
        .update({ balance: senderWallet.balance - amount });

      const updatedRecipient = await trx('wallets')
        .where({ id: recipientWallet.id })
        .update({ balance: recipientWallet.balance + amount });

      if (!updatedSender || !updatedRecipient) {
        throw new HttpException(
          'Failed to update wallets',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const [senderTransactionId] = await trx('transactions')
        .insert({
          wallet_id: senderWallet.id,
          amount: -amount,
          type: 'transfer',
        })
        .returning('id');

      senderTrxId = senderTransactionId;

      //   console.log({ sendTransac });

      const recipientTransaction = await trx('transactions').insert({
        wallet_id: recipientWallet.id,
        amount,
        type: 'deposit',
      });

      if (!senderTransactionId || !recipientTransaction) {
        throw new HttpException(
          'Failed to record transactions',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    console.log({ senderTrxId });

    const sendTransac = await this.knex('transactions')
      .where('id', senderTrxId)
      .first();

    return sendTransac;
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

    await this.knex.transaction(async (trx) => {
      await trx('wallets')
        .where({ user_id: userId })
        .update({ balance: newBalance });

      await trx('transactions').insert({
        wallet_id: wallet.id,
        amount,
        type: 'withdrawal',
      });
    });

    return { balance: newBalance };
  }
}
