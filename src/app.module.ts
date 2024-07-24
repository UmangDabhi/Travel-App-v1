import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './trip/trip.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { TravellerModule } from './traveller/traveller.module';
import { Booking } from './booking/entities/booking.entity';
import { Traveller } from './traveller/entities/traveller.entity';
import { Trip } from './trip/entities/trip.entity';
import { User } from './user/entities/user.entity';

@Module({
  imports: [TripModule, UserModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "123",
      database: "Trip",
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    AuthModule,
    BookingModule,
    TravellerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
