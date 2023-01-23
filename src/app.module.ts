import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditModule } from './audit/audit.module';
import { Audit } from './audit/entity/audit.entity';
import { ClimateChangeDataCategory } from './master-data/cimate-change-data-category/climate.change.data.category.entity';
import { ProjectStatus } from './master-data/project-status/project-status.entity';
import { Project } from './project/entity/project.entity';
import * as ormconfig from './ormconfig';
import * as ormconfig_training from './ormconfig_training';
import { Country } from './country/entity/country.entity';
import { CountryModule } from './country/country.module';
import { ProjectOwner } from './master-data/project-owner/projeect-owner.entity';

import { FinancingSchemeController } from './master-data/financing-scheme/financing-scheme.controller';
import { FinancingSchemeModule } from './master-data/financing-scheme/financing-scheme.module';
import { DocumentModule } from './document/document.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProjectOwnerModule } from './master-data/project-owner/project-owner.module';
import { ProjectStatusModule } from './master-data/project-status/project-status.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { ProjectApprovalStatusModule } from './master-data/project-approval-status/project-approval-status.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InstitutionModule } from './institution/institution.module';
// import { UserController } from './user/user.controller';
// import { UserService } from './user/user.service';
import { InstitutionCategoryController } from './institution/institution-category.controller';
import { InstitutionCategoryService } from './institution/institution-category.service';
import { UserTypeModule } from './master-data/user-type/user-type.module';
import { LearningMaterialModule } from './learning-material/learning-material.module';
import { ReportModule } from './report/report.module';
import { ReportController } from './report/report.controller';


@Module({
  imports: [
    AuditModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forRoot(ormconfig_training),
    TypeOrmModule.forFeature([
      Audit,
      Project,
      ProjectStatus,
      ProjectOwner,
      ClimateChangeDataCategory,
      Country,
    ]),

    ProjectModule,
    AuditModule,
    CountryModule,
    ProjectOwnerModule,
    ProjectStatusModule,
    FinancingSchemeModule,
    DocumentModule,
    AuthModule,
    UsersModule,
    InstitutionModule,
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
    ProjectApprovalStatusModule,
    UserTypeModule,
    LearningMaterialModule,
    ReportModule,
 
  ],
  controllers: [
    AppController,
    FinancingSchemeController,
    FinancingSchemeController,

    ReportController,
    // InstitutionCategoryController,
    // UserController,
  ],
  providers: [AppService],
})
export class AppModule {}
