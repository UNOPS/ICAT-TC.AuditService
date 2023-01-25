import { Module } from '@nestjs/common';
import { ErrorlogService } from './errorlog.service';
import { ErrorlogController } from './errorlog.controller';
import { Errorlog } from './entities/errorlog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Errorlog])],
  controllers: [ErrorlogController],
  providers: [ErrorlogService],
  exports: [ErrorlogService]
})
export class ErrorlogModule {}
