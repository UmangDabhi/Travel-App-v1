import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { Traveller } from 'src/traveller/entities/traveller.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Traveller)
    private readonly travellerRepository: Repository<Traveller>,
  ) { }
  async create(createBookingDto: CreateBookingDto) {
    const { traveller, ...bookingData } = createBookingDto;
    console.log(traveller);
    console.log(bookingData);
    if (traveller) {
      const newTraveller = new Traveller();
      newTraveller.name = `${traveller.firstname} ${traveller.lastname}`;
      newTraveller.phone_no = parseInt(traveller.phone_no);
      newTraveller.secondary_phone_no = parseInt(traveller.secondary_phone_no);
      newTraveller.email = traveller.email;

      await this.travellerRepository.save(newTraveller);
    }
    const newBooking = new Booking();
    newBooking.departure_from = bookingData.departure_from;
    newBooking.selling_price = bookingData.selling_price;
    newBooking.advance_received = bookingData.advance_received;
    newBooking.total_pax = bookingData.total_pax;
    // newBooking.user = 
    return 'This action adds a new booking';
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
