import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
import * as moment from 'moment';
import { AuditService } from './audit.service';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';

@Crud({
    model: {
      type: Audit,
    },
    query: {
      join: {
        country: {
          eager: true,
        },
        user: {
          eager: true,
        },
        
      },
    },
  })

@Controller('audit')
export class AuditController implements CrudController<Audit> {
    constructor(public service: AuditService,
      @InjectRepository(Audit)
      public configService: ConfigService,) {}

    get base(): CrudController<Audit> {
        return this;
      }

      @Post()
      create(@Body() auditDto: AuditDto){
        return this.service.create(auditDto);
      }

      @Post('log')
      createCountry(@Body() auditDto: AuditDto){
        return this.service.createCountry(auditDto);
      }
      @Get(
        'audit/auditinfo/:page/:limit/:userType/:actionStatus/:logDate/:filterText/:institutionId', 
      )
      async getAuditDetails(
        @Query('page') page: number,
        @Query('limit') limit: number,
         @Query('userType') userType: string,
         @Query('actionStatus') actionStatus: string,
        @Query('logDate') logDate: string,
        @Query('filterText') filterText: string,
        @Query('institutionId') institutionId:number
        
      ): Promise<any> {
      
       var timestamp = Date.parse(logDate);
      var dateObject = new Date(timestamp);
      
        return await this.service.getAuditDetails(
          {
            limit: limit,
            page: page,
          },
          filterText,
          userType,
          actionStatus,
          logDate,
          institutionId,
        );

      }


      @Get(
        'audit/auditCountryinfo/:page/:limit/:userType/:actionStatus/:logDate/:filterText/:institutionId/:countryId/:loginusertype', 
      )
      async getAuditDetailsCountry(
        @Query('page') page: number,
        @Query('limit') limit: number,
         @Query('userType') userType: string,
         @Query('actionStatus') actionStatus: string,
        @Query('logDate') logDate: string,
        @Query('filterText') filterText: string,
        @Query('institutionId') institutionId:number,
        @Query('countryId') countryId:number,
        @Query('loginusertype') loginusertype:string,
      ): Promise<any> {
      
       var timestamp = Date.parse(logDate);
      var dateObject = new Date(timestamp);

        return await this.service.getAuditDetailsWithCountry(
          {
            limit: limit,
            page: page,
          },
          filterText,
          userType,
          actionStatus,
          logDate,
          institutionId,
          countryId,
          loginusertype
        );

      }

    

}

