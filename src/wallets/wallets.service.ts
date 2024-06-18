import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  CreateWalletDto,
  FundAccountDto,
  GetWalletDto,
  TransferFundsDto,
  WithdrawFundsDto,
} from './dto/wallets.dto';

@Injectable()
export class WalletsService {
  constructor(
    @Inject('KNEX_CONNECTION')
    private readonly knex: Knex,
  ) {}

  async getWallet(user_id: number, getData: GetWalletDto): Promise<any> {
    const wallet = await this.knex('wallets')
      .where({ user_id, currency: getData.currency })
      .first();

    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    return wallet;
  }

  async createWallet(
    user_id: number,
    createWalletDto: CreateWalletDto,
  ): Promise<any> {
    const existingWallet = await this.knex('wallets')
      .where({
        user_id,
        currency: createWalletDto.currency,
      })
      .first();

    if (existingWallet) {
      throw new HttpException(
        'Wallet already exists for this currency',
        HttpStatus.BAD_REQUEST,
      );
    }

    const [walletId] = await this.knex('wallets').insert({
      user_id,
      currency: createWalletDto.currency,
    });

    return await this.knex('wallets').where({ id: walletId }).first();
  }

  async fundAccount(user_id: number, updateWalletDto: FundAccountDto) {
    const wallet = await this.knex('wallets')
      .where({
        user_id,
        currency: updateWalletDto.currency,
      })
      .first();

    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    const newBalance = wallet.balance + updateWalletDto.amount;

    console.log({ newBalance });

    const newTransactions = await this.knex.transaction(async (trx) => {
      await trx('wallets')
        .where({ user_id, currency: updateWalletDto.currency })
        .update({ balance: newBalance });

      return await trx('transactions').insert({
        wallet_id: wallet.id,
        amount: updateWalletDto.amount,
        type: 'deposit',
        currency: updateWalletDto.currency,
      });
    });

    return await this.knex('wallets')
      .where({
        user_id,
        currency: updateWalletDto.currency,
      })
      .first();
  }

  async transferFunds(userId: number, transferData: TransferFundsDto) {
    const senderWallet = await this.knex('wallets')
      .join('users', 'wallets.user_id', 'users.id')
      .where('users.id', userId)
      .andWhere('wallets.currency', transferData.currency)
      .select('wallets.id', 'wallets.balance')
      .first();

    if (!senderWallet) {
      throw new HttpException('Sender wallet not found', HttpStatus.NOT_FOUND);
    }

    if (senderWallet.balance < transferData.amount) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    const recipientWallet = await this.knex('wallets')
      .join('users', 'wallets.user_id', 'users.id')
      .where('users.email', transferData.recipient_email)
      .andWhere('wallets.currency', transferData.currency)
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
        .update({ balance: senderWallet.balance - transferData.amount });

      const updatedRecipient = await trx('wallets')
        .where({ id: recipientWallet.id })
        .update({ balance: recipientWallet.balance + transferData.amount });

      if (!updatedSender || !updatedRecipient) {
        throw new HttpException(
          'Failed to update wallets',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const [senderTransactionId] = await trx('transactions')
        .insert({
          wallet_id: senderWallet.id,
          amount: -transferData.amount,
          type: 'transfer',
          currency: transferData.currency,
        })
        .returning('id');

      senderTrxId = senderTransactionId;

      const recipientTransaction = await trx('transactions').insert({
        wallet_id: recipientWallet.id,
        amount: transferData.amount,
        type: 'deposit',
        currency: transferData.currency,
      });

      if (!senderTransactionId || !recipientTransaction) {
        throw new HttpException(
          'Failed to record transactions',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });

    const sendTransac = await this.knex('transactions')
      .where('id', senderTrxId)
      .first();

    return sendTransac;
  }

  async withdraw(userId: number, withdrawalDto: WithdrawFundsDto) {
    const { amount, currency } = withdrawalDto;

    // Check if wallet exists for the user and currency
    const wallet = await this.knex('wallets')
      .where({ user_id: userId, currency })
      .first();

    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }

    // Check if sufficient balance
    if (wallet.balance < amount) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    // Perform withdrawal transaction
    const updatedWallet = await this.knex.transaction(async (trx) => {
      await trx('wallets')
        .where({ id: wallet.id })
        .update({ balance: wallet.balance - amount });

      // Log the withdrawal transaction
      const newTrx = await trx('transactions').insert({
        wallet_id: wallet.id,
        amount: -amount,
        type: 'withdrawal',
        currency: currency,
      });

      console.log({ newTrx });

      return trx('transactions').where({ id: newTrx[0] }).first();
    });

    return updatedWallet;
  }
}
