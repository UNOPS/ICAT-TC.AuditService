import { RecordStatus } from 'src/shared/entities/base.tracking.entity';

export class AuditDto {
  userName: string;
  description: string;
  actionStatus: string;
  userType: string;
  uuId: string;
  logDate : string;
  logTime: string;
  institutionId : number;

}