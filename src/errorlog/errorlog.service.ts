import { Injectable } from '@nestjs/common';
import { UpdateErrorlogDto } from './dto/update-errorlog.dto';
import {Errorlog} from './entities/errorlog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class ErrorlogService extends TypeOrmCrudService <Errorlog>{
  exp2 :any
  constructor( @InjectRepository(Errorlog) repo,){
    super(repo)
   }

  create(createErrorDto: Errorlog) {
    this.exp2 = {
      code : createErrorDto.code,
      logdate : createErrorDto.logdate,
      path: createErrorDto.path,
      method : createErrorDto.method,
      message : createErrorDto.message,
    
    }
    
    return this.repo.save(this.exp2);
  }

  findAll() {
    return `This action returns all errorlog`;
  }



  update(id: number, updateErrorlogDto: UpdateErrorlogDto) {
    return `This action updates a #${id} errorlog`;
  }

  remove(id: number) {
    return `This action removes a #${id} errorlog`;
  }
}
