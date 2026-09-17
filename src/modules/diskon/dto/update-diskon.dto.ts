import { PartialType } from '@nestjs/swagger';
import { CreateDiskonDto } from './create-diskon.dto';

export class UpdateDiskonDto extends PartialType(CreateDiskonDto) {}
