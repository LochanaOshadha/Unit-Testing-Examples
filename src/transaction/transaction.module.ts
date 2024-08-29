import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
