import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { Audit } from './audit/entity/audit.entity';
import * as ormconfig from './ormconfig';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { ErrorlogModule } from './errorlog/errorlog.module';
import { AuditCountry } from './audit/entity/auditCountry.entity';


@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forRoot(
      {
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        socketPath: process.env.SOCKET_PATH,
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
      }),
    TypeOrmModule.forFeature([
      Audit,
      AuditCountry
    ]),

    AuditModule,
    ErrorlogModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../static-files'),
      renderPath: 'icatcountryportal',
      exclude: ['/api*'],
      serveStaticOptions: { index: false },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ErrorlogModule,
 
  ],
  controllers: [
    AppController,
  ],
  providers: [AppService,
  {
   provide: APP_FILTER,
   useClass: HttpErrorFilter
  }],
})
export class AppModule {}

