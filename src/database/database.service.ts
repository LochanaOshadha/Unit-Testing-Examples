import { Injectable } from '@nestjs/common';
import { TransactionsEntity } from './entities/transactions.entity';
import { UsersEntity } from './entities/users.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    private entityManager: EntityManager,
    @InjectRepository(UsersEntity)
    private usersEntityRepository: Repository<UsersEntity>,
  ) {}

  public async addTxRecord(
    txRecord: TransactionsEntity,
  ): Promise<TransactionsEntity> {
    const savedTxRecord = await this.entityManager.transaction(
      async (em: EntityManager) => {
        return await em.save(TransactionsEntity, txRecord);
      },
    );
    return savedTxRecord;
  }

  public async getTxRecords(userId: number): Promise<TransactionsEntity[]> {
    const txRecords = await this.entityManager.transaction(
      async (em: EntityManager) => {
        return await em.find(TransactionsEntity, {
          where: { userId: userId },
          order: { id: 'DESC' },
        });
      },
    );
    return txRecords;
  }

  public async addUser(usersEntity: UsersEntity): Promise<UsersEntity> {
    const savedUser = await this.usersEntityRepository.save(usersEntity);
    return savedUser;
  }

  public async getUser(usersId: number): Promise<UsersEntity> {
    const userEntity = await this.usersEntityRepository.findOne({
      where: { id: usersId },
    });
    return userEntity;
  }
}
