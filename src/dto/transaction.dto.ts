import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
