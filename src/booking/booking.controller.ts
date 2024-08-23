import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindBookingDto } from './dto/find-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }


  @UseGuards(AuthGuard)
  @Post('create_booking')
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }


  @UseGuards(AuthGuard)
  @Post('my_bookings')
  findAll(@Body() findBookingDto: FindBookingDto) {
    return this.bookingService.findAll(findBookingDto);
  }

  @UseGuards(AuthGuard)
  @Get('get_one_booking/:id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch('update_booking/:id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete_booking/:id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Post('trip_info')
  findTripInfo(@Body() data: any) {
    return this.bookingService.findTripInfo(data);
  }
}
