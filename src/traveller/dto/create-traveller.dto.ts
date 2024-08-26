import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class CreateTravellerDto {
    @IsNotEmpty()
    traveller_name: string

    @IsNumber()
    phone_no: string

    @IsOptional()
    @IsNumber()
    secondary_phone_no: string

    @IsOptional()
    @IsEmail()
    email: string

    id:number
}
