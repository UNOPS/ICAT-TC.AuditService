import { ErrorlogService } from './errorlog.service';
import { UpdateErrorlogDto } from './dto/update-errorlog.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
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
    return this.errorlogService.findOne({where:{id:Number(id)}});
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
