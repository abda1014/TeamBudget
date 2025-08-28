// create-kostenteilung.dto.ts
import { IsUUID, IsInt, Min } from 'class-validator';

export class CreateKostenteilungDto {
  @IsUUID()
  zahlungId: string;

  @IsUUID()
  schuldnerId: string;

  @IsInt()
  @Min(0)
  wert: number; // in Cents
}
