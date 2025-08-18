import { PartialType } from '@nestjs/mapped-types';
import { CreateZahlungDto } from './create-zahlung.dto';

export class UpdateZahlungDto extends PartialType(CreateZahlungDto) {}
