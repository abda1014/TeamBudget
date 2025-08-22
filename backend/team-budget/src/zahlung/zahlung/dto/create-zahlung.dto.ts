// dto/create-zahlung.dto.ts
import { IsNotEmpty, IsString, IsUUID, IsInt, Min, IsDateString } from 'class-validator';

export class CreateZahlungDto {
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

    @IsDateString()
    datum!: string; // ISO-String (z. B. "2025-08-18T12:00:00Z")
}
