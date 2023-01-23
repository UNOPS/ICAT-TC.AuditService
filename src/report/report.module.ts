import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/project/entity/project.entity';
import { ProjectService } from 'src/project/project.service';
import { Report } from './entity/report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
    imports: [TypeOrmModule.forFeature([Report,  Project])],
    controllers: [ReportController],
    providers: [ReportService,  ProjectService],
    exports: [ReportService,  ProjectService],
})
export class ReportModule {}
