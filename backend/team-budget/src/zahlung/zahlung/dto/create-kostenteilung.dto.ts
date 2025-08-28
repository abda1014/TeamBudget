// create-kostenteilung.dto.ts
import { IsUUID, IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateKostenteilungDto {
  @IsUUID()
  zahlungId: string;

  @IsUUID()
  schuldnerId: string;

  @IsInt()
  @Min(0)
  wert: number; // in Cents

  @IsOptional()
  @IsBoolean()
  berücksichtigen?: boolean = true;
}
