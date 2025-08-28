import { Module } from '@nestjs/common';
import { ZahlungService } from './zahlung.service';
import { ZahlungController } from './zahlung.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zahlung } from './entities/zahlung.entity';
import { Kostenteilung } from './entities/kostenteilung.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zahlung, Kostenteilung])],
  controllers: [ZahlungController],
  providers: [ZahlungService],
})
export class ZahlungModule {}
