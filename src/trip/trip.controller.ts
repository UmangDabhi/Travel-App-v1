import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) { }

  @UseGuards(AuthGuard)
  @Post('create_trip')
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @UseGuards(AuthGuard)
  @Get('get_trips')
  findAll(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('searchQuery') searchQuery?: string,
  ) {
    return this.tripService.findAll(req,Number(page), Number(limit), searchQuery);
  }

  @UseGuards(AuthGuard)
  @Get('get_one_trip/:id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get('get_by_code/:tripCode')
  findOneByTripCode(@Param('tripCode') tripCode: string) {
    return this.tripService.findOneByTripCode(tripCode);
  }

  @UseGuards(AuthGuard)
  @Patch('update_trip/:id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(+id, updateTripDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete_trip/:id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}
