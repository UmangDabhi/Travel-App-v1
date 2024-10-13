import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Booking])],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule { }
