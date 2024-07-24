import { IsNotEmpty } from "class-validator";

export class CreateTripDto {
    @IsNotEmpty()
    trip_destination: string
    @IsNotEmpty()
    expected_date: string
    status: string
}
