import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UserIdDto } from './dto/user.id.dto';
import { TransactionService } from './transaction/transaction.service';
import { TransactionsEntity } from './database/entities/transactions.entity';
import { TransactionDto } from './dto/transaction.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private transactionService: TransactionService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('getTransactions')
  async getTransactions(
    @Query() params: UserIdDto,
  ): Promise<TransactionsEntity[]> {
    return await this.transactionService.getUsersTxEvents(params.userId);
  }

  @Post('creditAmount')
  async creditAmount(
    @Body() transaction: TransactionDto,
  ): Promise<TransactionsEntity> {
    return await this.transactionService.creditToUserAccount(
      transaction.userId,
      transaction.amount,
    );
  }

  @Post('debitAmount')
  async debitAmount(
    @Body() transaction: TransactionDto,
  ): Promise<TransactionsEntity> {
    return await this.transactionService.debitFromUserAccount(
      transaction.userId,
      transaction.amount,
    );
  }
}
