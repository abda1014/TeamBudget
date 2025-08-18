import { Module } from '@nestjs/common';
import { ZahlungService } from './zahlung.service';
import { ZahlungController } from './zahlung.controller';

@Module({
  controllers: [ZahlungController],
  providers: [ZahlungService],
})
export class ZahlungModule {}
