import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersEntity } from 'src/database/entities/users.entity';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  public async checkValidUser(userId: number): Promise<boolean> {
    const existingUser = await this.databaseService.getUser(userId);
    if (existingUser) {
      return true;
    } else {
      return false;
    }
  }

  public async addUser(user: UsersEntity): Promise<UsersEntity> {
    const savedUser = await this.databaseService.addUser(user);
    return savedUser;
  }
}
