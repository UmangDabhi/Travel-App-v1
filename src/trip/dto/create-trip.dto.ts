import { IsNotEmpty } from "class-validator";

export class CreateTripDto {
    @IsNotEmpty()
    trip_destination: string
    @IsNotEmpty()
    trip_type: string

    @IsNotEmpty()
    trip_duration: string

    @IsNotEmpty()
    expected_date: string
    status: string
}
