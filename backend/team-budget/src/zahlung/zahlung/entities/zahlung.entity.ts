// zahlung.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class Zahlung {
  @PrimaryGeneratedColumn('uuid', { name: 'zahlungs_id' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  beschreibung: string;

  // Betrag in Cents als Integer
  @Column({ type: 'int' })
  betrag: number;

  // Relation zum zahlenden User
  //Hier muss zugleich die gruppe ausgeführt werden .....
  @ManyToOne(() => User, (user) => user.username, { eager: true })
  @JoinColumn({
    name: 'user_id',
  })
  zahlender: User;

  @Column({ type: 'timestamp' })
  datum: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
