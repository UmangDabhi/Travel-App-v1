import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Traveller } from 'src/traveller/entities/traveller.entity';
import { Trip } from 'src/trip/entities/trip.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Booking,Traveller,Trip,User])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
