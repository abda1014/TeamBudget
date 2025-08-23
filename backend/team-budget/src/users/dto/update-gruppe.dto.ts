import { PartialType } from '@nestjs/mapped-types';
import { CreateGruppeDto } from './create-gruppe.dto';

export class UpdateGruppeDto extends PartialType(CreateGruppeDto) {}
