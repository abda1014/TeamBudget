import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateZahlungDto } from './dto/create-zahlung.dto';
import { UpdateZahlungDto } from './dto/update-zahlung.dto';
import { Zahlung } from './entities/zahlung.entity';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Kostenteilung } from './entities/kostenteilung.entity';
import { CreateKostenteilungDto } from './dto/create-kostenteilung.dto';

@Injectable()
export class ZahlungService {
  constructor(
    @InjectRepository(Zahlung)
    private readonly zahlungRepository: Repository<Zahlung>,
    @InjectRepository(Kostenteilung)
    private readonly kostenteilungRepository: Repository<Kostenteilung>,
  ) {}
  //Erstelle eine neue Zahlung + optionale Kostensplits (atomar)
  async create(
    createZahlungDto: CreateZahlungDto,
    splits?: CreateKostenteilungDto[],
  ): Promise<Zahlung> {
    return await this.zahlungRepository.manager.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const zahlungRepo = manager.getRepository(Zahlung);
      const ktRepo = manager.getRepository(Kostenteilung);
      const gruppeRepo = manager.getRepository(Gruppe);

      // 1) Lade Gruppe + prüfe Existenz
      const gruppe = await gruppeRepo.findOne({
        where: { id: createZahlungDto.gruppeId },
        relations: ['users'], // <- Stelle sicher, dass Gruppe.users existiert
      });
      if (!gruppe) {
        throw new NotFoundException(
          `Gruppe mit id ${createZahlungDto.gruppeId} nicht gefunden`,
        );
      }
      const gruppenUserIds = new Set(
        (gruppe as any).users?.map((u: User) => u.id) ?? [],
      );

      // 2) Lade zahlenden User + prüfe Gruppenmitgliedschaft
      const zahlender = await userRepo.findOneBy({
        id: createZahlungDto.zahlenderId,
      });
      if (!zahlender) {
        throw new NotFoundException(
          `Zahlender User mit id ${createZahlungDto.zahlenderId} nicht gefunden`,
        );
      }
      if (!gruppenUserIds.has(zahlender.id)) {
        throw new BadRequestException(
          `Zahlender User (${zahlender.id}) ist nicht Mitglied der Gruppe (${gruppe.id})`,
        );
      }

      // 3) Erzeuge Zahlung
      const zahlung = zahlungRepo.create({
        beschreibung: createZahlungDto.beschreibung,
        betrag: createZahlungDto.betragInCents, // <- Entity-Kommentar sagt "Euro"; hier nutzen wir Cents (int)
        datum: createZahlungDto.datum,
        zahlender,
        gruppe,
      } as Partial<Zahlung>);
      const savedZahlung = await zahlungRepo.save(zahlung);

      // 4) Splits bestimmen (übergeben oder automatisch erzeugen)
      let splitsToPersist: Array<{ schuldnerId: string; wert: number }> = [];

      if (splits && splits.length > 0) {
        // Validierung: Duplikate zusammenfassen (optional) oder ablehnen
        const aggregated = new Map<string, number>();
        for (const s of splits) {
          if (!s?.schuldnerId) {
            throw new BadRequestException(
              `Ein Split enthält keine schuldnerId.`,
            );
          }
          if (s.schuldnerId === zahlender.id) {
            throw new BadRequestException(
              `Zahlender darf nicht als Schuldner im Split auftauchen.`,
            );
          }
          if (!Number.isInteger(s.wert) || s.wert < 0) {
            throw new BadRequestException(
              `Split-Wert muss eine nichtnegative Ganzzahl (in Cents) sein.`,
            );
          }
          aggregated.set(
            s.schuldnerId,
            (aggregated.get(s.schuldnerId) ?? 0) + s.wert,
          );
        }
        splitsToPersist = Array.from(aggregated, ([schuldnerId, wert]) => ({
          schuldnerId,
          wert,
        }));
      } else {
        // Auto-Equal-Split: gleichmäßig auf alle Gruppenmitglieder außer dem Zahlenden
        const schuldnerIds = Array.from(gruppenUserIds).filter(
          (id) => id !== zahlender.id,
        );
        if (schuldnerIds.length === 0) {
          // Ein-Personen-Gruppe -> keine Schulden notwendig
          splitsToPersist = [];
        } else {
          const total = createZahlungDto.betragInCents;
          const n = schuldnerIds.length;
          const grund = Math.floor(total / n);
          let rest = total % n;

          splitsToPersist = schuldnerIds.map((id) => {
            const wert = grund + (rest > 0 ? 1 : 0);
            if (rest > 0) rest -= 1;
            return { schuldnerId: id as string, wert };
          });
        }
      }

      // 5) Validierungen auf Splits: Existenz + Gruppenmitgliedschaft + Summe
      if (splitsToPersist.length > 0) {
        // Lade alle Schuldner auf einen Schlag
        const schuldnerMap = new Map<string, User>();
        const schuldnerIds = splitsToPersist.map((s) => s.schuldnerId);
        const schuldnerUsers = await userRepo.findBy({ id: In(schuldnerIds) });

        schuldnerUsers.forEach((u) => schuldnerMap.set(u.id, u));

        for (const s of splitsToPersist) {
          const u = schuldnerMap.get(s.schuldnerId);
          if (!u) {
            throw new NotFoundException(
              `Schuldner User mit id ${s.schuldnerId} nicht gefunden`,
            );
          }
          if (!gruppenUserIds.has(s.schuldnerId)) {
            throw new BadRequestException(
              `Schuldner (${s.schuldnerId}) ist nicht Mitglied der Gruppe (${gruppe.id})`,
            );
          }
        }

        const sumSplits = splitsToPersist.reduce((acc, s) => acc + s.wert, 0);
        if (sumSplits !== createZahlungDto.betragInCents) {
          throw new BadRequestException(
            `Summe der Splits (${sumSplits}) entspricht nicht dem Zahlungsbetrag (${createZahlungDto.betragInCents}).`,
          );
        }

        // 6) Persistiere Kostenteilungen
        const ktEntities = splitsToPersist.map((s) =>
          ktRepo.create({
            zahlung: savedZahlung,
            schuldner: schuldnerMap.get(s.schuldnerId)!,
            wert: s.wert,
          } as Partial<Kostenteilung>),
        );
        await ktRepo.save(ktEntities);
      }

      // Optional: Zahlung inkl. Kostenteilungen zurückgeben
      // (erneut laden, um Relation verfügbar zu haben)
      return await zahlungRepo.findOne({
        where: { id: savedZahlung.id },
        relations: [
          'kostenteilungen',
          'kostenteilungen.schuldner',
          'zahlender',
          'gruppe',
        ],
      });
    });
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
  async findZahlungbyUser(user_id: string): Promise<Zahlung[]> {
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
  //Gib mir die Verbindlichkeiten des Users -> Dashboard
  async findAllVerbindlichkeitenenbyUser(user_id: string): Promise<number> {
    // ich kriege hier einen Array
    const kostenteilung = await this.findAllZahlungsSplitbyUser(user_id);
    if (!kostenteilung) {
      throw new NotFoundException(`Der User hat keine Schulden `);
    }
    const verbindlichkeitenList = kostenteilung
      .filter((i) => typeof i.wert === 'number')
      .map((i) => i.wert);
    const summe = verbindlichkeitenList.reduce((total, currentValue) => {
      return total + currentValue;
    }, 0);
    return summe;
  }
  //Gib mir den Schuldenbetrag des Users basierend auf die Gruppe
  async findVerbindlichkeitenbyUserinGroup(
    gruppen_id: string,
    user_id: string,
  ): Promise<number> {
    const verbindlichkeitenUser =
      await this.findAllZahlungsSplitbyUser(user_id);
    const verbindlichkeitenUserGruppe = verbindlichkeitenUser.filter(
      (i) => i.zahlung.gruppe.id == gruppen_id,
    );
    const verbindlichkeitenUserGruppeList = verbindlichkeitenUserGruppe
      .filter((i) => typeof i.wert === 'number')
      .map((i) => i.wert);
    const summe = verbindlichkeitenUserGruppeList.reduce(
      (total, currentValue) => {
        return total + currentValue;
      },
      0,
    );
    return summe;
  }

  //Gib mir den Forderungsbertrag des User basierend auf die Gruppe
  async findForderungenbyUserinGroup(
    gruppe_id: string,
    user_id: string,
  ): Promise<number> {
    const forderungen = await this.findZahlungbyUser(user_id);
    const forderungenUserGruppe = forderungen.filter(
      (i) => i.gruppe.id === gruppe_id,
    );
    const forderungenUserGruppeList = forderungenUserGruppe
      .filter((i) => typeof i.betrag === 'number')
      .map((i) => i.betrag);
    const summe = forderungenUserGruppeList.reduce((total, currentValue) => {
      return total + currentValue;
    }, 0);
    return summe;
  }

  //Gib  den gesamten Forderungsbetrag des Users wieder (wenn er Zahler war)->Dashboard
  async findAllForderungenfromUser(user_id: string): Promise<number> {
    const forderungen = await this.findZahlungbyUser(user_id);
    if (forderungen.length === 0 || !forderungen) {
      return 0;
    }
    const forderungsList = forderungen
      .filter((i) => typeof i.betrag === 'number')
      .map((i) => i.betrag);
    const summe = forderungsList.reduce((total, currentValue) => {
      return total + currentValue;
    }, 0);
    return summe;
  }

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

  /**
   * Entfernt eine Zahlung und alle zugehörigen Kostenteilungen.
   * Vorgehen:
   * - Lade Zahlung; wenn nicht vorhanden -> NotFoundException
   * - Lade alle Kostenteilungen, die zur Zahlung gehören und entferne sie
   * - Entferne die Zahlung
   * Rückgabe: Objekt mit der gelöschten Zahlung Id
   */
  async remove(id: string): Promise<{ deletedZahlungId: string }> {
    const zahlung = await this.zahlungRepository.findOne({
      where: { id },
    });
    if (!zahlung) {
      throw new NotFoundException(`Zahlung mit id ${id} wurde nicht gefunden`);
    }

    // Da die Relation in Kostenteilung onDelete: 'CASCADE' gesetzt ist,
    // kümmert sich die DB/ORM um das Entfernen der zugehörigen Kostenteilungen.
    await this.zahlungRepository.remove(zahlung);
    return { deletedZahlungId: id };
  }
}
