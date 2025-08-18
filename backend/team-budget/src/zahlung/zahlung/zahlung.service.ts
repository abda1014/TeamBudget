import { Injectable } from '@nestjs/common';
import { CreateZahlungDto } from './dto/create-zahlung.dto';
import { UpdateZahlungDto } from './dto/update-zahlung.dto';

@Injectable()
export class ZahlungService {
  create(createZahlungDto: CreateZahlungDto) {
    return 'This action adds a new zahlung';
  }

  findAll() {
    return `This action returns all zahlung`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zahlung`;
  }

  update(id: number, updateZahlungDto: UpdateZahlungDto) {
    return `This action updates a #${id} zahlung`;
  }

  remove(id: number) {
    return `This action removes a #${id} zahlung`;
  }
}
