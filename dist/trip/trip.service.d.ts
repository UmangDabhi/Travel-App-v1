import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
export declare class TripService {
    private readonly tripRepository;
    constructor(tripRepository: Repository<Trip>);
    create(createTripDto: CreateTripDto): Promise<Trip>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    findOneByTripCode(tripCode: string): Promise<any>;
    update(id: number, updateTripDto: UpdateTripDto): Promise<Trip>;
    remove(id: number): Promise<any>;
    private getTripCode;
    private generateTripCode;
}
