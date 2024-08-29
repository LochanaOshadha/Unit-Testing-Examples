import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';
import { UsersEntity } from 'src/database/entities/users.entity';

describe('UsersService', () => {
  let lastIssuedUserId = 0;
  const mockDatabaseService = {
    getUser: jest.fn((userId: number) => {
      if (userId == 1) {
        return {
          id: 1,
          name: 'mockUser',
          password: 'mockUserPassword',
        };
      } else {
        return null;
      }
    }),
    addUser: jest.fn((user: UsersEntity) => {
      lastIssuedUserId += 1;
      return { id: lastIssuedUserId, ...user };
    }),
  };
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return as valid user', async () => {
    const isValid = await service.checkValidUser(1);
    expect(isValid).toBeTruthy();
  });

  it('should be return as invalid user', async () => {
    const isValid = await service.checkValidUser(2);
    expect(isValid).toBeFalsy();
  });
});
