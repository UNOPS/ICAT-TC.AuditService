import { PartialType } from '@nestjs/swagger';
import { CreateErrorlogDto } from './create-errorlog.dto';

export class UpdateErrorlogDto extends PartialType(CreateErrorlogDto) {}
