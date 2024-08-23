import { CreateTravellerDto } from './dto/create-traveller.dto';
import { UpdateTravellerDto } from './dto/update-traveller.dto';
export declare class TravellerService {
    create(createTravellerDto: CreateTravellerDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTravellerDto: UpdateTravellerDto): string;
    remove(id: number): string;
}
