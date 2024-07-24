import { Module } from '@nestjs/common';
import { TravellerService } from './traveller.service';
import { TravellerController } from './traveller.controller';
import { Traveller } from './entities/traveller.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Traveller])],
  controllers: [TravellerController],
  providers: [TravellerService],
})
export class TravellerModule {}
