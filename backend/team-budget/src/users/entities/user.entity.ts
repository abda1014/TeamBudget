import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gruppe } from './gruppe.entity';

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
  private vorname: string;
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

  @ManyToMany(() => Gruppe, (gruppe) => gruppe.users, { eager: true })
  gruppe: Gruppe[];
}
