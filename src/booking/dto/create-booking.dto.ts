// src/booking/dto/create-booking.dto.ts
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTravellerDto } from '../../traveller/dto/create-traveller.dto';

export class CreateBookingDto {
  @IsNotEmpty()
  departure_from: string;

  @IsNumber()
  total_pax: number;

  @IsNumber()
  selling_price: number;

  @IsNumber()
  advance_received: number;

  @IsNotEmpty()
  sharing_type: string;

  @IsNotEmpty()
  trip_id: number;

  @IsNotEmpty()
  parent_id: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateTravellerDto)
  traveller: CreateTravellerDto;
}
