import { PartialType } from '@nestjs/mapped-types';
import { CreateKostenteilungDto } from './create-kostenteilung.dto';

export class UpdateKostenteilungDto extends PartialType(
  CreateKostenteilungDto,
) {}
