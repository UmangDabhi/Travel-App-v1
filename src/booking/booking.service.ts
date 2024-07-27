import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { Traveller } from 'src/traveller/entities/traveller.entity';
import { User } from 'src/user/entities/user.entity';
import { Trip } from 'src/trip/entities/trip.entity';
import { responseHandler } from 'src/Utils/responseHandler';

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

      let newTraveller: Traveller | null = null;

      if (traveller) {
        // Construct the name to match in the database
        const fullName = `${traveller.firstname} ${traveller.lastname}`;

        // Check if a traveller with the same phone_no and name already exists
        const existingTraveller = await this.travellerRepository.findOne({
          where: {
            phone_no: parseInt(traveller.phone_no),
            name: fullName
          }
        });

        if (existingTraveller) {
          // Use the existing traveller
          newTraveller = existingTraveller;
        } else {
          // Create a new traveller if none exists
          newTraveller = this.travellerRepository.create({
            name: fullName,
            phone_no: parseInt(traveller.phone_no),
            ...traveller.secondary_phone_no && { secondary_phone_no: parseInt(traveller.secondary_phone_no) },
            ...traveller.email && { email: traveller.email }
          });
          console.log(newTraveller);
          await this.travellerRepository.save(newTraveller);
        }
      }

      // Find user and trip
      const user = await this.userRepository.findOneBy({ id: parent_id });
      const trip = await this.tripRepository.findOneBy({ id: trip_id });

      if (!user || !trip) {
        throw new Error('Invalid user or trip');
      }

      // Create and save new booking
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
      return responseHandler(500, "Internal Server Error");
    }
  }



  async findAll() {
    try {
      const bookings = await this.bookingRepository.find();
      const allBookings = bookings.map(booking => ({
        ...booking,
        total_amount: booking.total_amount,
        pending_amount: booking.pending_amount,
      }));
      return responseHandler(200, 'Bookings fetched successfully', allBookings);
    } catch (error) {
      console.error(error);
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async findOne(id: number) {
    try {
      let booking = await this.bookingRepository.findOneBy({ id });
      if (!booking) {
        return responseHandler(404, 'User Not Found');
      }
      booking = {
        ...booking,
        total_amount: booking.total_amount,
        pending_amount: booking.pending_amount,
      };
      return responseHandler(200, 'Booking fetched successfully', booking);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, 'Booking Not Found');
      }
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    try {
      const { traveller, parent_id, trip_id, ...bookingData } = updateBookingDto;

      // Find existing booking
      const existingBooking = await this.bookingRepository.findOne({ where: { id } });
      if (!existingBooking) {
        return responseHandler(404, 'Booking Not Found');
      }

      // Update traveller if provided
      let updatedTraveller: Traveller | null = null;
      if (traveller && traveller.id) {
        const existingTraveller = await this.travellerRepository.findOne({ where: { id: traveller.id } });
        if (!existingTraveller) {
          return responseHandler(404, 'Traveller Not Found');
        }

        // Construct the name to match in the database
        const fullName = `${traveller.firstname} ${traveller.lastname}`;
        await this.travellerRepository.update(traveller.id, {
          name: fullName,
          phone_no: parseInt(traveller.phone_no),
          ...traveller.secondary_phone_no && { secondary_phone_no: parseInt(traveller.secondary_phone_no) },
          ...traveller.email && { email: traveller.email }
        });
        updatedTraveller = await this.travellerRepository.findOne({ where: { id: traveller.id } });
      }else{
        return responseHandler(400, 'Invalid Traveller Data');
      }

      // Find user and trip
      const user = await this.userRepository.findOne({ where: { id: parent_id } });
      const trip = await this.tripRepository.findOne({ where: { id: trip_id } });

      if (!user || !trip) {
        return responseHandler(400, 'Invalid user or trip');
      }

      // Update booking
      await this.bookingRepository.update(id, {
        ...bookingData,
        user,
        trip,
        traveller: updatedTraveller || existingBooking.traveller,
      });

      return responseHandler(200, 'Booking updated successfully');
    } catch (error) {
      console.error(error);
      return responseHandler(500, 'Internal Server Error');
    }
  }


  async remove(id: number) {
    try {
      const booking = await this.bookingRepository.findOneBy({ id });
      if (!booking) {
        return responseHandler(404, 'Booking Not Found');
      }
      const deletedBooking = await this.bookingRepository.softDelete(id);
      console.log(deletedBooking);
      return responseHandler(200, 'Booking Deleted Successfully', deletedBooking);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, 'User Not Found');
      }
      return responseHandler(500, "Internal Server Error");
    }
  }
}
