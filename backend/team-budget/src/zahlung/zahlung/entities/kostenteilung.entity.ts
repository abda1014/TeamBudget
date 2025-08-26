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
  @ManyToOne(() => Zahlung, (zahlung) => zahlung.betrag)
  @JoinColumn({
    name: 'zahlung_id',
  })
  zahlung: Zahlung;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  schuldner: User;

  @Column({ type: 'int' })
  wert: number;

  @Column({ type: 'bool' })
  berücksichtigen: boolean;
}
