import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateGruppeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDate()
  datum: Date;

  // Lieber ids statt ganze entitis von users -> ladet zu langsam
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  userIds: string[];
}
