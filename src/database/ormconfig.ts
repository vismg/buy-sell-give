import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'buysellgive',
  entities: [__dirname + '/../**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
});
