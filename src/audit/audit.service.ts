import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse, Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';

@Injectable()
export class AuditService extends TypeOrmCrudService<Audit> {
  contextUser: any;
  constructor(@InjectRepository(Audit) repo, @Inject(REQUEST) private request) {
    super(repo);
  }

  async create(auditDto: AuditDto) {
    auditDto.logDate = new Date().toLocaleString();

    var newaudit = await this.repo.save(auditDto);
  }

  
  
    async getAuditDetails(
      options: IPaginationOptions,
      filterText: string,
      uuId: string,
      actionStatus: string,
      logDate: string,
      description : string,
      userType : string,
      userName : string,
      institutionId:number
    ): Promise<Pagination<Audit>> {
      let filter: string = '';
      // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;
  
      if (filterText != null && filterText != undefined && filterText != '') {
        filter =
          // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
          '(dr.userName LIKE :filterText OR dr.actionStatus LIKE :filterText  OR dr.logDate LIKE :filterText OR dr.description LIKE :filterText  OR dr.userType LIKE :filterText )';
      }
  
      if (uuId != null && uuId != undefined && uuId != '') {
        if (filter) {
          filter = `${filter}  and dr.uuId= :uuId`;
        } else {
          filter = `dr.uuId = :uuId`;
        }
      }
    

      if (actionStatus != null && actionStatus != undefined && actionStatus != '') {
        if (filter) {
          filter = `${filter}  and dr.actionStatus= :actionStatus`;
        } else {
          filter = `dr.actionStatus = :actionStatus`;
        }
      }
      if (logDate != null && logDate != undefined && logDate != '') {
        if (filter) {
          filter =
            `${filter}  and(  dr.logDate LIKE :logDate)`;
        } else filter = '( dr.logDate LIKE :logDate)';
      }
  
      if (description != null && description != undefined && description != '') {
        if (filter) {
          filter = `${filter}  and dr.description LIKE :description`;
        } else {
          filter = `dr.description LIKE :description`;
        }
  
      }
  
      if (userType != null && userType != undefined && userType != '') {
  
        if (filter) {
          filter = `${filter}  and dr.userType = :userType`;
        } else {
          filter = `dr.userType = :userType`;
        }
      }
      
      if (userName != null && userName != undefined && userName != '') {
  
        if (filter) {
          filter = `${filter}  and dr.userName LIKE :userName`;
        } else {
          filter = `dr.userName LIKE :userName`;
        }
      }


  
      if (institutionId != null && institutionId != undefined ) {
  
        // let user = await this.userRepo.findOne({
        //   where: { email: },
        // });
  
        if (filter) {
          filter = `${filter}  and dr.institutionId = :institutionId`;
        } else {
          filter = `dr.institutionId = :institutionId`;
        }
      }
      // if (editedOn != null && editedOn != undefined && editedOn != '') {
      //     if (filter) {
      //      let editdate = `dr.editedOn`;
      //      console.log('mmm','dr.editedOn')
      //       filter = `${filter}  and (dr.editedOn LIKE :editedOn)`;
      //     } else {
      //       filter = `dr.editedOn = :editedOn`;
      //     }
      //   }
  
      let data = this.repo
        .createQueryBuilder('dr')
   
  
        // .innerJoinAndMapOne('dr.country', Country, 'coun', 'dr.countryId = coun.id')
  
        .where(filter, {
          filterText: `%${filterText}%`,
          uuId,
          actionStatus,
          logDate: `%${logDate}%`,
          description,
          userType,
          userName,
          institutionId

        })
        .orderBy('dr.logDate', 'DESC');
      // console.log(
      //   '=====================================================================',
      // );
      // console.log(`dr.editedOn`);
  
      let result = await paginate(data, options);
      // console.log("rrrrrrr----",resualt.items[1].user.institution)
  
      if (result) {
        return result;
      }
    }
  }
  

