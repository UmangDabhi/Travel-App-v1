import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.tripService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }
  
  @UseGuards(AuthGuard)
  @Get('getByCode/:tripCode')
  findOneByTripCode(@Param('tripCode') tripCode: string) {
    return this.tripService.findOneByTripCode(tripCode);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(+id, updateTripDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}
