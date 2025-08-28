import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gruppe } from './gruppe.entity';
import { Zahlung } from 'src/zahlung/zahlung/entities/zahlung.entity';

@Entity()
export class User {
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  vorname: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nachname: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @Exclude()
  passwordHash: string;
  // Ist das von mir ünerhaupt richtig mit den paramter?
  @ManyToMany(() => Gruppe, (gruppe) => gruppe.users, { eager: true })
  gruppe: Gruppe[];

  // bidirektional !!!!  User → Zahlungen -> GET /users/:id
  @OneToMany(() => Zahlung, (zahlung) => zahlung.zahlender)
  zahlungen: Zahlung[];
}
