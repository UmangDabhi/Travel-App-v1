import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { Traveller } from 'src/traveller/entities/traveller.entity';
import { User } from 'src/user/entities/user.entity';
import { Trip } from 'src/trip/entities/trip.entity';
import { FindBookingDto } from './dto/find-booking.dto';
export declare class BookingService {
    private readonly bookingRepository;
    private readonly travellerRepository;
    private readonly userRepository;
    private readonly tripRepository;
    constructor(bookingRepository: Repository<Booking>, travellerRepository: Repository<Traveller>, userRepository: Repository<User>, tripRepository: Repository<Trip>);
    create(createBookingDto: CreateBookingDto): Promise<any>;
    findAll(findBookingDto: FindBookingDto): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateBookingDto: UpdateBookingDto): Promise<any>;
    remove(id: number): Promise<any>;
    findTripInfo(data: any): Promise<any>;
}
