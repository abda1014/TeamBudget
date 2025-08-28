import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { IsNotEmpty } from 'class-validator';
import { Zahlung } from './zahlung.entity';

@Entity()
export class Kostenteilung {
  @IsNotEmpty()
  @PrimaryGeneratedColumn('uuid', { name: 'kostenteilungs_id' })
  id: string;

  @IsNotEmpty()
  // onDelete: 'CASCADE' sorgt dafür, dass beim Entfernen einer Zahlung
  // alle zugehörigen Kostenteilungen von der DB entfernt werden.
  @ManyToOne(() => Zahlung, (zahlung) => zahlung.kostenteilungen, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'zahlung_id' })
  zahlung: Zahlung;

  // Schuldner als Relation zum User (statt Column mit User-Typ)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'schuldner_id' })
  schuldner: User;

  @Column({ type: 'int' })
  wert: number;
}
