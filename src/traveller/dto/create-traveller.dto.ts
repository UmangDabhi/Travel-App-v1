import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class CreateTravellerDto {
    @IsNotEmpty()
    firstname: string

    @IsNotEmpty()
    lastname: string

    @IsNumber()
    phone_no: string

    @IsOptional()
    @IsNumber()
    secondary_phone_no: string

    @IsOptional()
    @IsEmail()
    email: string

    id:number

    get name(): string {
        return `${this.firstname} ${this.lastname}`;
    }
}
