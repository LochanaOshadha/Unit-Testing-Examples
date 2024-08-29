import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TransactionsEntity } from 'src/database/entities/transactions.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TransactionService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
  ) {}

  public async creditToUserAccount(
    userId: number,
    amount: number,
  ): Promise<TransactionsEntity> {
    const validUser = await this.usersService.checkValidUser(userId);
    if (validUser) {
      const currentBalance = await this.checkUserAccountBalance(userId);
      const updatedBalance = currentBalance + amount;
      const transaction: TransactionsEntity = {
        userId: userId,
        txAmount: amount,
        balance: updatedBalance,
      };
      const savedTransaction = await this.databaseService.addTxRecord(
        transaction,
      );
      return savedTransaction;
    } else {
      throw new HttpException('invalid user', HttpStatus.BAD_REQUEST);
    }
  }

  public async debitFromUserAccount(
    userId: number,
    amount: number,
  ): Promise<TransactionsEntity> {
    const validUser = await this.usersService.checkValidUser(userId);
    if (validUser) {
      const currentBalance = await this.checkUserAccountBalance(userId);
      if (currentBalance >= amount) {
        const updatedBalance = currentBalance - amount;
        const transaction: TransactionsEntity = {
          userId: userId,
          txAmount: amount,
          balance: updatedBalance,
        };
        const savedTransaction = await this.databaseService.addTxRecord(
          transaction,
        );
        return savedTransaction;
      } else {
        throw new HttpException('not enough balance', HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException('invalid user', HttpStatus.BAD_REQUEST);
    }
  }

  public async getUsersTxEvents(userId: number): Promise<TransactionsEntity[]> {
    const validUser = await this.usersService.checkValidUser(userId);
    if (validUser) {
      const transactions = await this.databaseService.getTxRecords(userId);
      return transactions;
    } else {
      throw new HttpException('invalid user', HttpStatus.BAD_REQUEST);
    }
  }

  public async checkUserAccountBalance(userId: number): Promise<number> {
    const transactions = await this.databaseService.getTxRecords(userId);
    if (transactions.length == 0) {
      return 0;
    }
    return transactions[0].balance;
  }
}
