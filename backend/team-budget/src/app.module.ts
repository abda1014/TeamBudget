import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ZahlungModule } from './zahlung/zahlung/zahlung.module';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { appConfigSchema } from './config/config.types';
import { appConfig } from './config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Zahlung } from './zahlung/zahlung/entities/zahlung.entity';
import { Kostenteilung } from './zahlung/zahlung/entities/kostenteilung.entity';
import { Gruppe } from './users/entities/gruppe.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeOrmConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        // allowUnknown: false,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        // console.log('TypeORM-Konfiguration:', dbConfig);
        entities: [User, Gruppe, Zahlung, Kostenteilung],
      }),
    }),
    UsersModule,
    ZahlungModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
