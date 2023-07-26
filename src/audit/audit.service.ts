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
    institutionId: number,
    countryId: number,
    loginusertype: string
  ): Promise<Pagination<Audit>> {
    let filter: string = '';
    // let fDate = `${editedOn.getFullYear()}-${editedOn.getMonth()+1}-${editedOn.getDate()}`;


    if (filterText != null && filterText != undefined && filterText != '') {
      filter = '(dr.userName LIKE :filterText OR dr.actionStatus LIKE :filterText  OR dr.logDate LIKE :filterText OR dr.description LIKE :filterText  OR dr.userType LIKE :filterText )';
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

    if (userType == null || userType || undefined || userType == '') {
      if (loginusertype == "Country Admin") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('Country Admin','Institution Admin','Verifier','Sector Admin', 'Technical Team', 'Data Collection Team','QC Team','Data Entry Operator','MRV Admin')`;
        } else {
          filter = `dr.userType in ('Country Admin','Institution Admin','Verifier','Sector Admin','Technical Team','Data Collection Team','QC Team','Data Entry Operator','MRV Admin')`;
        }
      }
      else if (loginusertype == "Verifier") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('Verifier')`;
        } else {
          filter = `dr.userType in ('Verifier')`;
        }
      }
      else if (loginusertype == "Sector Admin") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('Institution Admin','Verifier','Sector Admin', 'Technical Team', 'Data Collection Team','QC Team','Data Entry Operator','MRV Admin')`;
        } else {
          filter = `dr.userType in ('Institution Admin','Verifier','Sector Admin','Technical Team','Data Collection Team','QC Team','Data Entry Operator','MRV Admin')`;
        }
      }
      else if (loginusertype == "Technical Team") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('Verifier', 'Technical Team', 'Data Collection Team','QC Team','Data Entry Operator','MRV Admin')`;
        } else {
          filter = `dr.userType in ('Verifier','Technical Team','Data Collection Team','QC Team','Data Entry Operator','MRV Admin')`;
        }
      }
      else if (loginusertype == "Data Collection Team") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('Verifier','Data Collection Team','QC Team','Data Entry Operator','MRV Admin')`;
        } else {
          filter = `dr.userType in ('Verifier','Data Collection Team','QC Team','Data Entry Operator','MRV Admin')`;
        }
      }
      else if (loginusertype == "QC Team") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('QC Team')`;
        } else {
          filter = `dr.userType in ('QC Team')`;
        }
      }
      else if (loginusertype == "Institution Admin") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('Data Entry Operator','Institution Admin')`;
        } else {
          filter = `dr.userType in ('Data Entry Operator','Institution Admin')`;
        }
      }
      else if (loginusertype == "Data Entry Operator") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('Data Entry Operator')`;
        } else {
          filter = `dr.userType in ('Data Entry Operator')`;
        }
      }
      else if (loginusertype == "MRV Admin") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('MRV Admin')`;
        } else {
          filter = `dr.userType in ('MRV Admin')`;
        }
      }
      else if (loginusertype == "External") {
        if (filter) {
          filter = `${filter}  and dr.userType in ('External')`;
        } else {
          filter = `dr.userType in ('External')`;
        }
      }

    }
    if (userType != null && userType != undefined && userType != '') {

      if (filter) {
        filter = `${filter}  and dr.userType = :userType`;
      } else {
        filter = `dr.userType = :userType`;
      }
    }

    if (loginusertype != "Master_Admin") {
      if (filter) {
        filter = `${filter}  and dr.countryId = :countryId`;
      } else {
        filter = `dr.countryId = :countryId`;
      }
    }


    if (loginusertype != "Master_Admin" && institutionId != null && institutionId != undefined) {

      if (filter) {
        filter = `${filter}  and dr.institutionId = :institutionId`;
      } else {
        filter = `dr.institutionId = :institutionId`;
      }
    }

    console.log(filter)
    let data = this.auditCountryRepo
      .createQueryBuilder('dr')
      .where(filter, {
        filterText: `%${filterText}%`,
        actionStatus,
        logDate: `%${logDate}%`,
        userType,
        institutionId,
        countryId,
      })
      .orderBy('dr.logDate', 'DESC');

    let result = await paginate(data, options);
    console.log(result.items.length)
    return result;
  }


}


