// src/booking/dto/create-booking.dto.ts
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FindBookingDto {
    @IsNotEmpty()
    parent_id:number
}
