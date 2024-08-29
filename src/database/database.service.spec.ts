import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';
import { DataSource, Repository } from 'typeorm';
import { createMemoryDb } from '../databaseFiles/pg-mem.util';
import { UsersEntity } from './entities/users.entity';
import { TransactionsEntity } from './entities/transactions.entity';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';

describe('DatabaseService', () => {
  let userRepository: Repository<UsersEntity>;
  let service: DatabaseService;
  let dataSource: DataSource;
  let module: TestingModule;
  beforeAll(async () => {
    dataSource = await createMemoryDb([UsersEntity, TransactionsEntity]);
    await dataSource.synchronize();
    module = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: getRepositoryToken(UsersEntity),
          useFactory: () => dataSource.getRepository(UsersEntity),
        },
        {
          provide: getEntityManagerToken(),
          useFactory: () => dataSource.createEntityManager(),
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
    userRepository = dataSource.getRepository(UsersEntity);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add user', async () => {
    const user: UsersEntity = {
      name: 'testUser',
      password: 'abc123',
    };
    const savedUser = await service.addUser(user);
    const userInDb = await userRepository.findOne({
      where: { name: user.name },
    });
    expect(savedUser.id).toEqual(userInDb.id);
    expect(savedUser.name).toEqual(userInDb.name);
    expect(savedUser.password).toEqual(userInDb.password);
  });
});
