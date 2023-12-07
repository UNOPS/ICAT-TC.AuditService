import { ConnectionOptions } from 'typeorm';
const config: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME, 
  
  entities: [__dirname + '/**/*.entity{.ts,.js}'], 

  synchronize: true,

  migrationsRun: false,
  logging: true,
  logger: 'file',

  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = config;
