import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZahlungService } from './zahlung.service';
import { CreateZahlungDto } from './dto/create-zahlung.dto';
import { UpdateZahlungDto } from './dto/update-zahlung.dto';

@Controller('zahlung')
export class ZahlungController {
  constructor(private readonly zahlungService: ZahlungService) {}

  @Post()
  create(@Body() createZahlungDto: CreateZahlungDto) {
    return this.zahlungService.create(createZahlungDto);
  }

  @Get()
  findAll() {
    return this.zahlungService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zahlungService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZahlungDto: UpdateZahlungDto) {
    return this.zahlungService.update(+id, updateZahlungDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zahlungService.remove(+id);
  }
}
