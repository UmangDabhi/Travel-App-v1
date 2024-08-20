import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './trip/trip.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { TravellerModule } from './traveller/traveller.module';
import { ConfigModule } from '@nestjs/config';
import { Booking } from './booking/entities/booking.entity';
import { Traveller } from './traveller/entities/traveller.entity';
import { Trip } from './trip/entities/trip.entity';
import { User } from './user/entities/user.entity';

@Module({
  imports: [TripModule, UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    BookingModule,
    TravellerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
