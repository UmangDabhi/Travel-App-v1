import { IsEmail, IsNotEmpty } from "class-validator";

export class ChangePasswordDto{
    @IsNotEmpty()
    @IsEmail()
    email:string
    @IsNotEmpty()
    old_password:string
    @IsNotEmpty()
    new_password:string
}