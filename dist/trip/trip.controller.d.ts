import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
export declare class TripController {
    private readonly tripService;
    constructor(tripService: TripService);
    create(createTripDto: CreateTripDto): Promise<import("./entities/trip.entity").Trip>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    findOneByTripCode(tripCode: string): Promise<any>;
    update(id: string, updateTripDto: UpdateTripDto): Promise<import("./entities/trip.entity").Trip>;
    remove(id: string): Promise<any>;
}
