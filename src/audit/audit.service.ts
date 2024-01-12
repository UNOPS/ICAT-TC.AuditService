import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { AuditDto } from './dto/audit-dto';
import { Audit } from './entity/audit.entity';
import { AuditCountry } from './entity/auditCountry.entity';
import { filter } from 'rxjs';
import { UserTypes, UserTypesEnum } from './enum/user-type.enum';

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

    auditDto.logDate = y;
    var newaudit = await this.auditCountryRepo.save(auditDto);
    return newaudit;
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

    if (filterText != null && filterText != undefined && filterText != '') {
      filter =
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

      if (filter) {
        filter = `${filter}  and dr.institutionId = :institutionId`;
      } else {
        filter = `dr.institutionId = :institutionId`;
      }
    }

    let data = this.repo
      .createQueryBuilder('dr')

      .where(filter, {
        filterText: `%${filterText}%`,
        actionStatus,
        logDate: `%${logDate}%`,
        userType,
        institutionId
      })
      .orderBy('dr.logDate', 'DESC');

    let result = await paginate(data, options);

    if (result) {
      return result;
    }
  }

  /**
   * 
   *country admin -> country admin, country user
   country user -> country user
   external user -> external user
   master admin -> country admin, country user, master admin
   */
  async getAuditDetailsWithCountry(
    options: IPaginationOptions,
    filterText: string,
    userType: string,
    description: string,
    logDate: string,
    institutionId: number,
    countryId: number,
    loginusertype: string,
    userName: string=''
  ): Promise<Pagination<Audit>> {
    let data = this.auditCountryRepo
      .createQueryBuilder('dr')
      .orderBy('dr.logDate', 'DESC')
      .orderBy('dr.logTime', 'DESC')
    if (filterText != null && filterText != undefined && filterText != '') {
      data.andWhere('(dr.userName LIKE :filterText OR dr.actionStatus LIKE :filterText  OR dr.logDate LIKE :filterText OR dr.description LIKE :filterText  OR dr.userType LIKE :filterText )', { filterText: `%${filterText}%` })
    }
    if (description != null && description != undefined && description != '') {
      data.andWhere('dr.description = :description', { description: description })
    }
    if (logDate != null && logDate != undefined && logDate != '') {
      data.andWhere('dr.logDate LIKE :logDate', { logDate: logDate })
    }

    if (userType == null || userType || undefined || userType == '') {
      let type = UserTypes.find(o => o.name === loginusertype)
      if (type) {
        loginusertype = type.code
      }

      let allowedTypes: UserTypesEnum[]
      if (loginusertype === UserTypesEnum.COUNTRY_ADMIN) {
        allowedTypes = UserTypes.filter(type => [UserTypesEnum.COUNTRY_ADMIN, UserTypesEnum.COUNTRY_USER].includes(type.code))
          .map(type => type.code);
      } else if (loginusertype === UserTypesEnum.COUNTRY_USER) {
        data.andWhere('dr.userName = :userName', {userName: userName})
        allowedTypes = UserTypes.filter(type => [UserTypesEnum.COUNTRY_USER].includes(type.code))
          .map(type => type.code);
      } else if (loginusertype === UserTypesEnum.MASTER_ADMIN) {
        allowedTypes = UserTypes.filter(type => [UserTypesEnum.COUNTRY_ADMIN, UserTypesEnum.COUNTRY_USER, UserTypesEnum.MASTER_ADMIN].includes(type.code))
          .map(type => type.code);
      } else if (loginusertype === UserTypesEnum.EXTERNAL) {
        UserTypes.filter(type => [UserTypesEnum.EXTERNAL].includes(type.code))
          .map(type => type.code);
      }
      data.andWhere('dr.userType IN (:types)', { types: allowedTypes })
    }

    if (userType != null && userType != undefined && userType != '') {
      data.andWhere('dr.userType = :userType', { userType: userType })
    }

    if (loginusertype != UserTypesEnum.MASTER_ADMIN && countryId != null && countryId != undefined) {
      data.andWhere('dr.countryId = :countryId', { countryId: countryId })
    }

    // if (loginusertype != UserTypesEnum.MASTER_ADMIN && institutionId != null && institutionId != undefined) {
    //   data.andWhere('dr.institutionId = :institutionId', { institutionId: institutionId })
    // }

    console.log(data.getQuery(), data.getParameters())
    console.log(JSON.stringify(data.getMany()))
    let result = await paginate(data, options);
    return result;
  }

  /**Not using function */
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
    return result;
  }


}


