import { ErrorlogService } from './errorlog.service';
import { CreateErrorlogDto } from './dto/create-errorlog.dto';
import { UpdateErrorlogDto } from './dto/update-errorlog.dto';

import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query,Request } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import {Errorlog} from './entities/errorlog.entity';

@Controller('errorlog')
export class ErrorlogController {
  constructor(private readonly errorlogService: ErrorlogService) {}

  
  @Post('customNewsAdd')
  async create( @Body() errorlog: Errorlog): Promise<any> {
    this.errorlogService.create(errorlog)
   return errorlog
  }
  

  @Get()
  findAll() {
    return this.errorlogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.errorlogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateErrorlogDto: UpdateErrorlogDto) {
    return this.errorlogService.update(+id, updateErrorlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.errorlogService.remove(+id);
  }
}
