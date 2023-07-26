import { Body, Controller, Get, Post, Query, UseGuards,Optional, DefaultValuePipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Crud, CrudController } from '@nestjsx/crud';
import * as moment from 'moment';
import { audit } from 'rxjs';
import { Repository } from 'typeorm';
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
      // private readonly projectRepository: Repository<Audit>,
      public configService: ConfigService,) {}

    get base(): CrudController<Audit> {
        return this;
      }

      @Post()
      create(@Body() auditDto: AuditDto){
        console.log("Post request")
        return this.service.create(auditDto);
      }

      @Post('createCountry')
      createCountry(@Body() auditDto: AuditDto){
        console.log("Post request  :", auditDto)
        return this.service.createCountry(auditDto);
      }
/*  
      @Get(
        'audit/auditinfo/:page/:limit/:uuId/:actionStatus/:logDate/:description/:userType/:userName', 
      )
      async getAuditDetails(
        @Optional() @Query('page') page: number,
        @Optional() @Query('limit') limit: number,
        @Optional() @Query('uuId') uuId: string,
        @Optional()  @Query('actionStatus') actionStatus: string,
        @Optional()  @Query('logDate') logDate: string,
        @Optional() @Query('description') description: string,
        @Optional() @Query('userType') userType:string,
        @Optional() @Query('userName') userName:string
        
      ): Promise<any> {
        
       //let editedOnnew= moment(editedOn, "DD/MM/YYYY");

        return await this.service.getAuditDetails(
          {
            limit: limit,
            page: page,
          },
          uuId,
          actionStatus,
          logDate,
          description,
          userType,
          userName
        );

      }  */


    /*   @Get(
        'audit/auditinfo/:page/:limit/:uuId/:actionStatus/:logDate/:description/:userType/:userName', 
      )
      async getAuditDetails(

        @Optional() @Query('page', new DefaultValuePipe(1)) page: number,
        @Optional() @Query('limit', new DefaultValuePipe(10)) limit: number,
        @Optional() @Query('uuId') uuId: string,
        @Optional() @Query('actionStatus') actionStatus: string,
        @Optional() @Query('logDate') logDate: string,
        @Optional() @Query('description') description: string,
        @Optional() @Query('userType') userType:string,
        @Optional() @Query('userName') userName:string
      ): Promise<any> {  console.log("hello")
        return await this.service.getAuditDetails(
          {
            limit: limit,
            page: page,
          },
          uuId,
          actionStatus,
          logDate,
          description,
          userType,
          userName
        );
      } */

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
      
       //let editedOnnew= moment(editedOn, "DD/MM/YYYY");
       console.log("hitttttttt : "+ logDate)
       var timestamp = Date.parse(logDate);
      var dateObject = new Date(timestamp);
      
      console.log('jjjjjjfffff',moment(logDate,'MM-DD-YYYY').format('MM-DD-YYYY'));
      console.log('hhh',logDate)
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

        return await this.service.getAuditDetailsCountry(
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

