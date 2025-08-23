import { User } from './user.entity';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Gruppe {
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid', { name: 'gruppen_id' })
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @CreateDateColumn()
  datum: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  @ManyToMany(() => User, (user) => user.gruppe)
  @JoinTable()
  users: User[];
}
