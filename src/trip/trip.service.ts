import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { responseHandler } from 'src/Utils/responseHandler';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) { }

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    const { trip_destination, expected_date } = createTripDto;
    const trip_code = await this.getTripCode();

    const newTrip = this.tripRepository.create({
      trip_code,
      trip_destination,
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
  async findAll(): Promise<any> {
    try {
      const trips = await this.tripRepository.find();
      return responseHandler(200, 'Trips fetched successfully', trips);
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
      if (!trip) {
        return responseHandler(404, 'Trip Not Found');
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
