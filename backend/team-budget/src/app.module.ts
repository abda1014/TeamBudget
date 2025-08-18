import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ZahlungModule } from './zahlung/zahlung/zahlung.module';

@Module({
  imports: [UsersModule, ZahlungModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
