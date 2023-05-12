import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { Audit } from './audit/entity/audit.entity';
import * as ormconfig from './ormconfig';
import * as ormconfig_training from './ormconfig_training';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';


import { MailerModule } from '@nestjs-modules/mailer';

// import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';

import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { ErrorlogModule } from './errorlog/errorlog.module';
import { AuditCountry } from './audit/entity/auditCountry.entity';


@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forRoot(ormconfig_training),
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
    MailerModule.forRoot({
      transport:{
        host: 'smtp.office365.com', 
        port:587,
       secure: false, 
       
       auth: {
        user: "no-reply-icat-ca-tool@climatesi.com",
        pass: "ICAT2022tool",

      },
        // 'smtp://janiya.rolfson49@ethereal.email:T8pnMS7xzzX7k3QSkM@ethereal.email',
      },
      defaults: {
        from: '"Admin" <no-reply-icat-ca-tool@climatesi.com>',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ErrorlogModule,
 
  ],
  controllers: [
    AppController,
    // InstitutionCategoryController,
    // UserController,
  ],
  providers: [AppService,
  {
   provide: APP_FILTER,
   useClass: HttpErrorFilter
  }],
})
export class AppModule {}

