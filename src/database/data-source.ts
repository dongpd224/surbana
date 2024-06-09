import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  host: 'db',
  type: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'nestjs',
  entities: ['dist/**/*.entity{ .ts,.js}'],
  synchronize: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
