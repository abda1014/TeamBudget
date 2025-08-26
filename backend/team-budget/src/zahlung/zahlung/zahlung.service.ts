import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateZahlungDto } from './dto/create-zahlung.dto';
import { UpdateZahlungDto } from './dto/update-zahlung.dto';
import { Zahlung } from './entities/zahlung.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Kostenteilung } from './entities/kostenteilung.entity';

@Injectable()
export class ZahlungService {
  constructor(
    @InjectRepository(Zahlung)
    private readonly zahlungRepository: Repository<Zahlung>,
    @InjectRepository(Kostenteilung)
    private readonly kostenteilungRepository: Repository<Kostenteilung>,
  ) {}
  //Erstelle eine neue Zahlung
  async create(createZahlungDto: CreateZahlungDto): Promise<Zahlung | null> {
    return await this.zahlungRepository.save(createZahlungDto);
  }
  //Gib mir den spezifischen Zahlungssplit
  async findZahlungsSplit(id: string): Promise<Kostenteilung> {
    const kostenteilung = await this.kostenteilungRepository.findOneBy({ id });
    if (!kostenteilung) {
      throw new NotFoundException('Es wurde keine Kostensplit gefunden');
    }
    return kostenteilung;
  }

  findAll() {
    return `This action returns all zahlung`;
  }

  //Gib mir alle Zahlungen einer Gruppe
  async findAllZahlungenfromGruppe(gruppen_id: string): Promise<Zahlung[]> {
    const zahlungen = await this.zahlungRepository.find({
      where: { gruppe: { id: gruppen_id } },
    });
    return zahlungen;
  }
  //Gib mir alle einzelne Zahlungen vom User
  async findZahlungvonUser(user_id: string): Promise<Zahlung[]> {
    const zahlung = await this.zahlungRepository.find({
      where: { zahlender: { id: user_id } },
    });
    if (!zahlung || zahlung.length === 0) {
      throw new NotFoundException(`Es wurde keine zahlungen gefunden`);
    }
    return zahlung;
  }
  //Gib mir alle ZahlungsSplit die den user betreffen -> valdiierung ob berücksichtigt ist gleich true
  async findAllZahlungsSplitbyUser(user_id: string): Promise<Kostenteilung[]> {
    const kostenteilung = await this.kostenteilungRepository.find({
      where: {
        schuldner: {
          id: user_id,
        },
      },
    });
    if (!kostenteilung || kostenteilung.length === 0) {
      throw new NotFoundException('Der User hat keine Kosten');
    }
    return kostenteilung;
  }
  //Gib mir den Schuldenbetrag des Users
  async findAllSchulden(user_id: string): Promise<number> {
    // ich kriege hier einen Array
    const kostenteilung = await this.findAllZahlungsSplitbyUser(user_id);
    if (!kostenteilung) {
      throw new NotFoundException(`Der User hat keine Schulden `);
    }
    const schuldenList = kostenteilung
      .filter((i) => typeof i.wert === 'number')
      .map((i) => i.wert);
    const summe = schuldenList.reduce((total, currentValue) => {
      return total + currentValue;
    }, 0);
    return summe;
  }
  //Gib mir den Schuldenbetrag des Users basierend auf die Gruppe

  //Gib mir den Schuldenbetrag der Gruppe

  //Gib  alle  Forderungen des Users wieder (wenn er Zahler war)
  async findAllForderungenfromUser(user_id: string): Promise<number> {
    const kostenteilung = await this.findAllZahlungsSplitbyUser(user_id);
    if (!kostenteilung) {
      throw new NotFoundException(`Der User hat keine Forderungen `);
    }
    const forderungList = kostenteilung
      .filter((i) => typeof i.zahlung === 'number')
      .map((i) => i.zahlung);
    const summe = forderungList.reduce((total, currentValue) => {
      return total + currentValue;
    }, 0);
    return summe;
  }

  //Gib mir den Forderungsbetrag des Users basierend auf die Gruppe

  //Gib mir den Saldo des Users

  //Gib mir den Saldo der Gruppe
  findOne(id: number) {
    return `This action returns a #${id} zahlung`;
  }
  // Bearbeite eine bestehende Zahlung
  async update(
    id: string,
    updateZahlungDto: UpdateZahlungDto,
  ): Promise<Zahlung> {
    const zahlung = await this.zahlungRepository.preload({
      id,
      ...updateZahlungDto,
    });
    if (!zahlung) {
      throw new NotFoundException(`Zahlung wurde nich gefunden `);
    }
    return this.zahlungRepository.save(zahlung);
  }

  remove(id: number) {
    return `This action removes a #${id} zahlung`;
  }
}
