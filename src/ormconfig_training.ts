import { ConnectionOptions } from 'typeorm';
const config: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
 username: 'root',
 password: 'pradeep123#',
 database: 'tc-audit', 
  
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
