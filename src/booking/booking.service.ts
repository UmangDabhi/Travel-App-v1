import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { Traveller } from 'src/traveller/entities/traveller.entity';
import { User } from 'src/user/entities/user.entity';
import { Trip } from 'src/trip/entities/trip.entity';
import { response } from 'express';
import { responseHandler } from 'src/Utils/responseHandler';
import { resolve } from 'path';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Traveller)
    private readonly travellerRepository: Repository<Traveller>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) { }

  async create(createBookingDto: CreateBookingDto) {
    try {
      const { traveller, parent_id, trip_id, ...bookingData } = createBookingDto;

      let newTraveller: Traveller;
      if (traveller) {
        newTraveller = this.travellerRepository.create({
          name: `${traveller.firstname} ${traveller.lastname}`,
          phone_no: parseInt(traveller.phone_no),
          secondary_phone_no: parseInt(traveller.secondary_phone_no),
          email: traveller.email
        });
        await this.travellerRepository.save(newTraveller);
      }

      const user = await this.userRepository.findOneBy({ id: parent_id });
      const trip = await this.tripRepository.findOneBy({ id: trip_id });

      if (!user || !trip) {
        throw new Error('Invalid user or trip');
      }

      const newBooking = this.bookingRepository.create({
        ...bookingData,
        user,
        trip,
        traveller: newTraveller
      });

      await this.bookingRepository.save(newBooking);
      return responseHandler(201, "Booking Successful", newBooking);

    } catch (error) {
      console.error(error);
      responseHandler(500, "Internal Server Error");

    }
  }


  async findAll() {
    try {
      const bookings = await this.bookingRepository.find();
      return responseHandler(200, 'Bookings fetched successfully', bookings);
    } catch (error) {
      console.error(error);
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async findOne(id: number) {
    try {
      const booking = await this.bookingRepository.findOneBy({id});
      if (!booking) {
        return responseHandler(404, 'User Not Found');
      }
      return responseHandler(200, 'Booking fetched successfully', booking);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, 'Booking Not Found');
      }
      return responseHandler(500, 'Internal Server Error');
    }
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
