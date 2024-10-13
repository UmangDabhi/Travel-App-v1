import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, Res } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FindBookingDto } from './dto/find-booking.dto';
import { Response } from 'express';

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
  findAll(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('searchQuery') searchQuery?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('destination') destination?: string,
    @Query('type') type?: string,
  ) {
    return this.bookingService.findAll(req, Number(page), Number(limit), searchQuery, from, to, destination, type);
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

  @UseGuards(AuthGuard)
  @Get('export/:trip_id')
  async getAllBookingsForTrip(@Param('trip_id') tripId: number, @Req() req: any, @Res() res: Response) {
    console.log(tripId);
    return this.bookingService.findAllForTrip(tripId, req, res);
  }
}
