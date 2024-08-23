import { TravellerService } from './traveller.service';
import { CreateTravellerDto } from './dto/create-traveller.dto';
import { UpdateTravellerDto } from './dto/update-traveller.dto';
export declare class TravellerController {
    private readonly travellerService;
    constructor(travellerService: TravellerService);
    create(createTravellerDto: CreateTravellerDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTravellerDto: UpdateTravellerDto): string;
    remove(id: string): string;
}
