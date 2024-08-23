import { CreateTravellerDto } from '../../traveller/dto/create-traveller.dto';
export declare class CreateBookingDto {
    departure_from: string;
    total_pax: number;
    selling_price: number;
    advance_received: number;
    trip_id: number;
    parent_id: number;
    traveller: CreateTravellerDto;
}
