import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Gruppe } from './entities/gruppe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateGruppeDto } from './dto/update-gruppe.dto';
import { CreateGruppeDto } from './dto/create-gruppe.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Gruppe)
    private readonly gruppeRepsoitory: Repository<Gruppe>,
  ) {}
  // Einen User erstellen
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUserDto);
  }
  // Eine Gruppe erstellen
  async createGruppe(createGruppeDto: CreateGruppeDto): Promise<Gruppe> {
    return await this.gruppeRepsoitory.save(createGruppeDto);
  }

  findAll() {
    return this.userRepository.find();
  }
  // gib mir den user basierend aus der gruppe
  async findOneUser(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User mit der #${id} wurde nicht gefunden `);
    }
    return user;
  }
  //Gib mir alle gruppen  des Users
  async findGruppe(user_id: string): Promise<Gruppe[]> {
    const user = await this.findOneUser(user_id);
    const gruppe = user.gruppe;
    if (!gruppe || gruppe.length === 0) {
      throw new NotFoundException(`Es wurden keine Gruppen hinzugefügt`);
    }
    return gruppe;
  }
  //Gib mir alle User die sich in der Gruppe befinden
  async findAllUserinGruppe(id: string): Promise<User[]> {
    const gruppe = await this.gruppeRepsoitory.findOneBy({ id });
    if (!gruppe || !gruppe.users || gruppe.users.length === 0) {
      throw new NotFoundException(
        `Es wurden keine user gefunden zur Gruppen id #${id}`,
      );
    }
    return gruppe.users;
  }
  //Gib mir die Gruppe wo sich der User befindet
  async findUserfromgruppe(
    user_id: string,
    gruppe_id: string,
  ): Promise<Gruppe> {
    const gruppedesUser = await this.findGruppe(user_id);
    const gruppe = gruppedesUser.find((g) => g.id === gruppe_id);
    if (!gruppe) {
      throw new NotFoundException('Die Gruppe wurde nicht gefunden ');
    }
    return gruppe;
  }
  //Einen User aktualisieren
  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }
  // Eine Gruppe aktualisieren
  async updateGruppe(
    gruppe: Gruppe,
    updateGruppeDto: UpdateGruppeDto,
  ): Promise<Gruppe> {
    Object.assign(gruppe, updateGruppeDto);
    return await this.gruppeRepsoitory.save(gruppe);
  }
  //Lösche den User von der Gruppe
  async removeUserfromGruppe(user: User, gruppe_id: string): Promise<void> {
    const gruppe = await this.findUserfromgruppe(user.id, gruppe_id);
    // remove the user from the group's users array and persist
    if (gruppe.users && gruppe.users.length > 0) {
      gruppe.users = gruppe.users.filter((u) => u.id !== user.id);
      await this.gruppeRepsoitory.save(gruppe);
    }
  }
  //Lösche die Gruppe
  async removeGruppe(gruppe: Gruppe): Promise<void> {
    await this.gruppeRepsoitory.delete({ id: gruppe.id });
  }
}
