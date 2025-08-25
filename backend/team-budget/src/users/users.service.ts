import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Gruppe } from './entities/gruppe.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Gruppe)
    private readonly gruppeRepsoitory: Repository<Gruppe>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }
  // gib mir den user basierend aus der gruppe
  async findOneUser(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User mit der #${id} wurde nicht gefunden `);
    }
    return user;
  }
  //Gib mir die gruppe des Users
  async findGruppe(id: string): Promise<Gruppe[]> {
    const user = await this.findOneUser(id);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
