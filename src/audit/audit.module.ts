import { Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { Audit } from './entity/audit.entity';
import { AuditCountry } from './entity/auditCountry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audit,AuditCountry])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService]
})
export class AuditModule {

}
