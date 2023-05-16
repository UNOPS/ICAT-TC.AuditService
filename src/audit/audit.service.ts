import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse, Override } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { timeStamp } from 'console';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Like, Repository } from 'typeorm';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';
import { AuditCountry } from './entity/auditCountry.entity';

@Injectable()
export class AuditService extends TypeOrmCrudService<Audit> {
  contextUser: any;
  constructor(@InjectRepository(Audit) repo, @Inject(REQUEST) private request,
  @InjectRepository(AuditCountry) private readonly auditCountryRepo: Repository<AuditCountry>,) {
    super(repo);
  }

  async create(auditDto: AuditDto) {
    let date = new Date()

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    let y = `${year}-${month}-${day}`;

    auditDto.logTime = new Date().toLocaleTimeString();

    console.log("dateeeee")
    console.log(y)
    auditDto.logDate = y
    var newaudit = await this.repo.save(auditDto);
    return newaudit
  }

  async createCountry(auditDto: AuditDto) {
    let date = new Date()

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    let y = `${year}-${month}-${day}`;

    auditDto.logTime = new Date().toLocaleTimeString();

    console.log("dateeeee")
    console.log(y)
    auditDto.logDate = y
    var newaudit = await this.auditCountryRepo.save(auditDto);
    return newaudit
  }
  
  async getAuditDetails(
    options: IPaginationOptions,
    filterText: string,
    userType: string,
    actionStatus: string,
    logDate: string,
    institutionId: number
  ): Promise<Pagination<Audit>> {
    let filter: string = '';
    // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
        '(dr.userName LIKE :filterText OR dr.actionStatus LIKE :filterText  OR dr.logDate LIKE :filterText OR dr.description LIKE :filterText  OR dr.userType LIKE :filterText )';
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


    if (userType != null && userType != undefined && userType != '') {

      if (filter) {
        filter = `${filter}  and dr.userType = :userType`;
      } else {
        filter = `dr.userType = :userType`;
      }
    }


    if (institutionId != null && institutionId != undefined) {

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
        actionStatus,
        logDate: `%${logDate}%`,
        userType,
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

  async getAuditDetailsCountry(
    options: IPaginationOptions,
    filterText: string,
    userType: string,
    actionStatus: string,
    logDate: string,
    institutionId: number
  ): Promise<Pagination<Audit>> {
    let filter: string = '';
    // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;


    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
        // '(dr.climateActionName LIKE :filterText OR dr.description LIKE :filterText)';
        '(dr.userName LIKE :filterText OR dr.actionStatus LIKE :filterText  OR dr.logDate LIKE :filterText OR dr.description LIKE :filterText  OR dr.userType LIKE :filterText )';
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


    if (userType != null && userType != undefined && userType != '') {

      if (filter) {
        filter = `${filter}  and dr.userType = :userType`;
      } else {
        filter = `dr.userType = :userType`;
      }
    }


    if (institutionId != null && institutionId != undefined) {

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

    let data = this.auditCountryRepo
      .createQueryBuilder('dr')


      // .innerJoinAndMapOne('dr.country', Country, 'coun', 'dr.countryId = coun.id')

      .where(filter, {
        filterText: `%${filterText}%`,
        actionStatus,
        logDate: `%${logDate}%`,
        userType,
        institutionId
      })
      .orderBy('dr.logDate', 'DESC');
    // console.log(
    //   '=====================================================================',
    // );
    // console.log(`dr.editedOn`);

    console.log("options", options)
    console.log("filterText", filterText)
    console.log("userType", userType)
    console.log("actionStatus", actionStatus)
    console.log("institutionId", institutionId)
    console.log("logDate", logDate)

    let result = await paginate(data, options);
    // console.log("rrrrrrr----",resualt.items[1].user.institution)

    if (result) {
      console.log("resulttt : ", result)
      return result;
    }
  }


  }
  

