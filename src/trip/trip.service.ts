import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, LessThan, Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { responseHandler } from 'src/Utils/responseHandler';
import { UpdateTripDto } from './dto/update-trip.dto';
import { getMapKeysValue, statusMap, tripDurationMap } from '../Helper/helper'
import { Booking } from 'src/booking/entities/booking.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) { }

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    const { trip_destination, expected_date, trip_type, trip_duration } = createTripDto;
    const trip_code = await this.getTripCode();

    const newTrip = this.tripRepository.create({
      trip_code,
      trip_duration,
      trip_destination,
      trip_type,
      expected_date,
    });
    try {
      const trip = await this.tripRepository.save(newTrip);
      return responseHandler(201, "Trip Created Sucessfully", trip);
    } catch (error) {
      console.error('Error creating Trip:', error);
      if (error instanceof ConflictException)
        return responseHandler(409, 'Trip code already exists');
      return responseHandler(500, "Internal Server Error");
    }
  }
  async findAll(req, page: number = 1, limit: number = 10, searchQuery?: string, pending?: string): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      let queryOptions: any = {
        where: {},
        order: { expected_date: 'ASC' },
        skip,
        take: limit,
      };

      if (searchQuery) {
        const statusValues = getMapKeysValue(searchQuery, statusMap);
        const tripDurationValues = getMapKeysValue(searchQuery, tripDurationMap);

        queryOptions.where = [
          { trip_code: ILike(`%${searchQuery}%`) },
          { trip_destination: ILike(`%${searchQuery}%`) },
          { trip_type: ILike(`%${searchQuery}%`) },
          { expected_date: ILike(`%${searchQuery}%`) },
        ];

        if (statusValues.length > 0) {
          queryOptions.where.push({ status: In(statusValues) });
        }
        if (tripDurationValues.length > 0) {
          queryOptions.where.push({ trip_duration: In(tripDurationValues) });
        }
      }
      if (pending) {
        queryOptions.where = { status: LessThan(1) };
      }

      const [trips, total] = await this.tripRepository.findAndCount(queryOptions);

      const totalPages = Math.ceil(total / limit);

      return responseHandler(200, 'Trips fetched successfully', { trips, total, totalPages, currentPage: page });
    } catch (error) {
      console.error('Error fetching Trips:', error);
      return responseHandler(500, "Internal Server Error");
    }
  }


  async findOne(id: number): Promise<any> {
    try {
      const trip = await this.tripRepository.findOneBy({ id });
      if (!trip) {
        throw new NotFoundException('Trip not found');
      }
      return responseHandler(200, 'Trip fetched successfully', trip);
    } catch (error) {
      console.error('Error fetching Trip:', error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, "Trip Not Found");
      }
      return responseHandler(500, "Internal Server Error");
    }
  }
  async findOneByTripCode(tripCode: string): Promise<any> {
    try {
      const trip = await this.tripRepository.findOneBy({ trip_code: tripCode });
      if (!trip) {
        throw new NotFoundException('Trip not found');
      }
      return responseHandler(200, 'Trip fetched successfully', trip);
    } catch (error) {
      console.error('Error fetching Trip:', error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, "Trip Not Found");
      }
      return responseHandler(500, "Internal Server Error");
    }
  }
  async update(id: number, updateTripDto: UpdateTripDto): Promise<Trip> {
    try {
      await this.tripRepository.update(id, updateTripDto);
      return responseHandler(200, 'Trip updated successfully');
    } catch (error) {
      console.error('Error updating Trip:', error);
      return responseHandler(500, "Internal Server Error");
    }
  }
  async remove(id: number): Promise<any> {
    try {
      const trip = await this.tripRepository.findOneBy({ id });
      const bookings = await this.bookingRepository.find({ where: { trip: { id: trip.id } }, relations: ['trip'] });

      if (!trip) {
        return responseHandler(404, 'Trip Not Found');
      }
      if (bookings && bookings.length > 0) {
        return responseHandler(409, 'Cannot Delete Trip With Bookings');
      }
      await this.tripRepository.softDelete(id);
      return responseHandler(200, 'Trip soft deleted successfully');
    } catch (error) {
      console.error('Error deleting Trip:', error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, "Trip Not Found");
      }
      return responseHandler(500, "Internal Server Error");
    }
  }


  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkAndUpdateTripStatuses() {
    const currentDate = new Date();
    const trips = await this.tripRepository.find({ where: { status: In([0, 1]) } }); // Find pending, destined, and ongoing trips

    trips.forEach(async (trip) => {
      const tripEndDate = new Date(trip.expected_date);
      tripEndDate.setDate(tripEndDate.getDate() + this.getDaysFromDuration(trip.trip_duration));

      if (currentDate >= new Date(trip.expected_date) && currentDate < tripEndDate && trip.status === 0) {
        trip.status = 1; // Set status to 'On Going'
        await this.tripRepository.save(trip);
      } else if (currentDate >= tripEndDate && trip.status === 1) {
        trip.status = 2; // Set status to 'Completed'
        await this.tripRepository.save(trip);
      }
    });
    console.log('Cron job executed - Trip statuses updated');
  }

  private getDaysFromDuration(trip_duration: string): number {
    const durationMap = {
      '1': 2, // 1 night 2 days
      '2': 3, // 2 nights 3 days
      '3': 4, // 3 nights 4 days
      '4': 5, // 4 nights 5 days
      '5': 6, // 5 nights 6 days
      '6': 7, // 6 nights 7 days
      '7': 8, // 7 nights 8 days
      '8': 9, // 8 nights 9 days
      '9': 10, // 9 nights 10 days
      '10': 11, // 10 nights 11 days
      '11': 12, // 11 nights 12 days
    };

    return durationMap[trip_duration] || 0;
  }


  private async getTripCode(): Promise<string> {
    let trip_code: string;
    let isCodeUnique = false;

    while (!isCodeUnique) {
      trip_code = this.generateTripCode();

      const existingTrip = await this.tripRepository.findOne({ where: { trip_code } });

      if (!existingTrip) {
        isCodeUnique = true;
      }
    }
    return trip_code;
  }
  private generateTripCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '#PT';
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
