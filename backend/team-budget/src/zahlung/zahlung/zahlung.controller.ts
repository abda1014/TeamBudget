import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ZahlungService } from './zahlung.service';
import { CreateZahlungDto } from './dto/create-zahlung.dto';
import { CreateKostenteilungDto } from './dto/create-kostenteilung.dto';

@Controller('zahlungen')
export class ZahlungController {
  constructor(private readonly zahlungService: ZahlungService) {}

  // Erstelle eine Zahlung, optional mit Kostenteilungen
  @Post()
  async create(
    @Body()
    body: {
      zahlung: CreateZahlungDto;
      splits?: CreateKostenteilungDto[];
    },
  ) {
    const { zahlung, splits } = body;
    return await this.zahlungService.create(zahlung, splits);
  }

  // Alle Zahlungen
  @Get()
  findAll() {
    return this.zahlungService.findAll();
  }

  // Zahlungen einer Gruppe
  @Get('group/:gruppenId')
  findAllByGroup(@Param('gruppenId') gruppenId: string) {
    return this.zahlungService.findAllZahlungenfromGruppe(gruppenId);
  }

  // Zahlungen eines Users (als Zahler)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.zahlungService.findZahlungbyUser(userId);
  }

  // Alle Kostenteilungs‑Splits, die einen User betreffen
  @Get('splits/user/:userId')
  findSplitsByUser(@Param('userId') userId: string) {
    return this.zahlungService.findAllZahlungsSplitbyUser(userId);
  }

  // Ein spezfischer Split
  @Get('splits/:id')
  findSplit(@Param('id') id: string) {
    return this.zahlungService.findZahlungsSplit(id);
  }

  // Verbindlichkeiten Gesamt (Dashboard)
  @Get('verbindlichkeiten/user/:userId')
  findVerbindlichkeiten(@Param('userId') userId: string) {
    return this.zahlungService.findAllVerbindlichkeitenenbyUser(userId);
  }

  // Verbindlichkeiten des Users innerhalb einer Gruppe
  @Get('verbindlichkeiten/group/:gruppenId/user/:userId')
  findVerbindlichkeitenByUserInGroup(
    @Param('gruppenId') gruppenId: string,
    @Param('userId') userId: string,
  ) {
    return this.zahlungService.findVerbindlichkeitenbyUserinGroup(
      gruppenId,
      userId,
    );
  }

  // Lösche eine Zahlung (Cascade löscht Splits)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zahlungService.remove(id);
  }
}
