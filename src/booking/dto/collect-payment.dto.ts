import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsNotEmpty } from 'class-validator';

export class CollectPaymentDto {
    @IsNotEmpty()
    collected_amount: number
    @IsNotEmpty()
    collection_type: number
    @IsNotEmpty()
    collected_by_id: any
}
