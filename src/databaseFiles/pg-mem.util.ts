import { DataSource } from 'typeorm';
import { newDb } from 'pg-mem';

export const createMemoryDb = async (entities: any[]) => {
  const db = newDb();

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  db.public.registerFunction({
    name: 'version',
    implementation: () => 'Im not sure about PostgreSQL version',
  });

  const dataSource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: entities,
    migrationsRun: false,
    migrationsTransactionMode: 'each',
    synchronize: false,
  });

  return dataSource.initialize();
};
