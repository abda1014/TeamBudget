// zahlung.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Gruppe } from 'src/users/entities/gruppe.entity';
import { Kostenteilung } from './kostenteilung.entity';

@Entity()
export class Zahlung {
  @PrimaryGeneratedColumn('uuid', { name: 'zahlungs_id' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  beschreibung: string;

  // Betrag in Euro
  @Column({ type: 'int' })
  betrag: number;

  // Relation zum zahlenden User
  //Hier müssen wir überprüfen das der user auch aus der gruppe ist!!
  @ManyToOne(() => User, (user) => user.username, { eager: true })
  @JoinColumn({
    name: 'user_id',
  })
  zahlender: User;

  @ManyToOne(() => Gruppe, (gruppe) => gruppe.id, { eager: true })
  @JoinColumn({
    name: 'gruppe_id',
  })
  gruppe: Gruppe;

  @Column({ type: 'timestamp' })
  datum: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Inverse relation zu Kostenteilung (nicht eager geladen)
  @OneToMany(() => Kostenteilung, (k) => k.zahlung)
  kostenteilungen?: Kostenteilung[];
}
