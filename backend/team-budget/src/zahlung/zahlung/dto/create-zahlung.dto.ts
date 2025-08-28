// dto/create-zahlung.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  Min,
  IsDate,
} from 'class-validator';

export class CreateZahlungDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  beschreibung!: string;

  // Betrag in Cents als Integer (vermeidet Float-Fehler, JSON-sicher)
  @IsInt()
  @Min(0)
  betragInCents!: number;

  // zahlender als User-ID; den User lädst du im Service
  @IsUUID()
  zahlenderId!: string;

  @IsDate()
  datum!: Date;
}
