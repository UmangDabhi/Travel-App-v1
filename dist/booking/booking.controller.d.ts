import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindBookingDto } from './dto/find-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    create(createBookingDto: CreateBookingDto): Promise<any>;
    findAll(findBookingDto: FindBookingDto): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateBookingDto: UpdateBookingDto): Promise<any>;
    remove(id: string): Promise<any>;
    findTripInfo(data: any): Promise<any>;
}
