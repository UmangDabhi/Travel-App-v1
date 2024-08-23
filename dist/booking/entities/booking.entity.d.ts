import { Traveller } from "src/traveller/entities/traveller.entity";
import { Trip } from "src/trip/entities/trip.entity";
import { User } from "src/user/entities/user.entity";
export declare class Booking {
    id: number;
    departure_from: string;
    total_pax: number;
    selling_price: number;
    advance_received: number;
    collected_amount: number;
    collection_type: number;
    payment_done: boolean;
    trip: Trip;
    traveller: Traveller;
    user: User;
    owner: User;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    get total_amount(): number;
    get pending_amount(): number;
}
