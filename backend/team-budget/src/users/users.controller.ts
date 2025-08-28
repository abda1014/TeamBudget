import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateGruppeDto } from './dto/create-gruppe.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findOneUser(id);
    return this.usersService.updateUser(user, updateUserDto);
  }

  // Gruppen des Users
  @Get(':id/groups')
  findGroups(@Param('id') id: string) {
    return this.usersService.findGruppe(id);
  }

  // Alle User in einer Gruppe
  @Get('groups/:id/users')
  findUsersInGroup(@Param('id') id: string) {
    return this.usersService.findAllUserinGruppe(id);
  }

  // Gruppe erstellen
  @Post('groups')
  createGroup(@Body() createGruppeDto: CreateGruppeDto) {
    return this.usersService.createGruppe(createGruppeDto);
  }
}
