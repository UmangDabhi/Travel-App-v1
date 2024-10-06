import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Between, Brackets, ILike, Raw, Repository } from 'typeorm';
import { Traveller } from 'src/traveller/entities/traveller.entity';
import { User } from 'src/user/entities/user.entity';
import { Trip } from 'src/trip/entities/trip.entity';
import { responseHandler } from 'src/Utils/responseHandler';
import { USER_ROLE } from 'src/Helper/helper';

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

        // Check if a traveller with the same phone_no and name already exists
        const existingTraveller = await this.travellerRepository.findOne({
          where: {
            phone_no: parseInt(traveller.phone_no),
            traveller_name: traveller.traveller_name,
          }
        });

        if (existingTraveller) {
          // Use the existing traveller
          newTraveller = existingTraveller;
        } else {
          // Create a new traveller if none exists
          newTraveller = this.travellerRepository.create({
            traveller_name: traveller.traveller_name,
            phone_no: parseInt(traveller.phone_no),
            ...traveller.secondary_phone_no && { secondary_phone_no: parseInt(traveller.secondary_phone_no) },
            ...traveller.email && { email: traveller.email }
          });
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

  async findAll(req: any, page: number = 1, limit: number = 10, searchQuery?: string, from?: string, to?: string, destination?: string, type?: string) {
    try {
      const skip = (page - 1) * limit;

      // Create the query builder
      const query = this.bookingRepository
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.trip', 'trip')
        .leftJoinAndSelect('booking.traveller', 'traveller')
        .leftJoinAndSelect('booking.user', 'user')
        .orderBy('booking.created_at', 'DESC')
        .skip(skip)
        .take(limit);

      // Apply user filter if the user is not ADMIN or MANAGER
      if (req.user.role !== USER_ROLE.ADMIN && req.user.role !== USER_ROLE.MANAGER) {
        query.andWhere('booking.user_id = :userId', { userId: req.user.id });
      }

      // Apply search query filtering (OR condition)
      if (searchQuery) {
        query.andWhere(
          new Brackets(qb => {
            qb.orWhere('booking.departure_from ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
              .orWhere('trip.trip_code ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
              .orWhere('trip.trip_destination ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
              .orWhere('traveller.traveller_name ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` })
              .orWhere('traveller.phone_no::varchar ILIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
          })
        );
      }

      function isValidDate(dateString: string): boolean {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
      }

    
      if (from && isValidDate(from)) {
        const fromDate = new Date(from).toISOString().split('T')[0];
        query.andWhere('CAST(trip.expected_date AS DATE) >= :fromDate', { fromDate });
      }

      if (to && isValidDate(to)) {
        const toDate = new Date(to).toISOString().split('T')[0];
        query.andWhere('CAST(trip.expected_date AS DATE) <= :toDate', { toDate });
      }

      if (destination) {
        console.log("yo yo");
        query.andWhere('trip.trip_destination ILIKE :destination', { destination: `%${destination}%` });
      }

      // Apply type filter
      if (type) {
        console.log("yo yo");
        query.andWhere('trip.trip_type = :type', { type });
      }

      // Execute the query and get results
      const bookings = await query.getMany();
      const total = await query.getCount();

      const allBookings = bookings.map(booking => ({
        ...booking,
        total_amount: booking.total_amount,
        pending_amount: booking.pending_amount,
      }));

      const totalPages = Math.ceil(total / limit);

      return responseHandler(200, 'Bookings fetched successfully', { allBookings, total, totalPages, currentPage: page });
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

        await this.travellerRepository.update(traveller.id, {
          traveller_name: traveller.traveller_name,
          phone_no: parseInt(traveller.phone_no),
          ...traveller.secondary_phone_no && { secondary_phone_no: parseInt(traveller.secondary_phone_no) },
          ...traveller.email && { email: traveller.email }
        });
        updatedTraveller = await this.travellerRepository.findOne({ where: { id: traveller.id } });
      } else {
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
      return responseHandler(200, 'Booking Deleted Successfully', deletedBooking);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, 'User Not Found');
      }
      return responseHandler(500, "Internal Server Error");
    }
  }

  async findTripInfo(data: any) {
    try {
      const trip = await this.tripRepository.findOne({ where: { trip_code: data.trip_code } });
      const bookings = await this.bookingRepository.find({ where: { trip: { id: trip.id } } })
      const travellersList = bookings.map(booking => ({
        id: booking.id,
        total_pax: booking.total_pax,
        pending_amount: booking.pending_amount,
        payment_done: booking.payment_done,
        traveller_name: booking.traveller.traveller_name,
        phone_no: booking.traveller.phone_no,
        secondary_phone_no: booking.traveller.secondary_phone_no,
        email: booking.traveller.email,
      }));
      return responseHandler(200, 'message to be changes', { travellersList });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, 'User Not Found');
      }
      return responseHandler(500, "Internal Server Error");
    }
  }
}
