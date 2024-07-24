import { IsEmail, IsNotEmpty, IsNumber } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    name: string
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    @IsNumber()
    phone_number: number
    
    password: string
    profile_url: string
}
