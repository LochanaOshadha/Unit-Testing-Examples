import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransactionsEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId: number;

  @Column()
  txAmount: number;

  @Column()
  balance: number;
}
