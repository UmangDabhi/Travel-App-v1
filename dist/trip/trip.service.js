"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trip_entity_1 = require("./entities/trip.entity");
const responseHandler_1 = require("../Utils/responseHandler");
let TripService = class TripService {
    constructor(tripRepository) {
        this.tripRepository = tripRepository;
    }
    async create(createTripDto) {
        const { trip_destination, expected_date } = createTripDto;
        const trip_code = await this.getTripCode();
        const newTrip = this.tripRepository.create({
            trip_code,
            trip_destination,
            expected_date,
        });
        try {
            const trip = await this.tripRepository.save(newTrip);
            return (0, responseHandler_1.responseHandler)(201, "Trip Created Sucessfully", trip);
        }
        catch (error) {
            console.error('Error creating Trip:', error);
            if (error instanceof common_1.ConflictException)
                return (0, responseHandler_1.responseHandler)(409, 'Trip code already exists');
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async findAll() {
        try {
            const trips = await this.tripRepository.find({ order: { created_at: 'DESC', }, });
            return (0, responseHandler_1.responseHandler)(200, 'Trips fetched successfully', trips);
        }
        catch (error) {
            console.error('Error fetching Trips:', error);
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async findOne(id) {
        try {
            const trip = await this.tripRepository.findOneBy({ id });
            if (!trip) {
                throw new common_1.NotFoundException('Trip not found');
            }
            return (0, responseHandler_1.responseHandler)(200, 'Trip fetched successfully', trip);
        }
        catch (error) {
            console.error('Error fetching Trip:', error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, "Trip Not Found");
            }
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async findOneByTripCode(tripCode) {
        try {
            const trip = await this.tripRepository.findOneBy({ trip_code: tripCode });
            if (!trip) {
                throw new common_1.NotFoundException('Trip not found');
            }
            return (0, responseHandler_1.responseHandler)(200, 'Trip fetched successfully', trip);
        }
        catch (error) {
            console.error('Error fetching Trip:', error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, "Trip Not Found");
            }
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async update(id, updateTripDto) {
        try {
            await this.tripRepository.update(id, updateTripDto);
            return (0, responseHandler_1.responseHandler)(200, 'Trip updated successfully');
        }
        catch (error) {
            console.error('Error updating Trip:', error);
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async remove(id) {
        try {
            const trip = await this.tripRepository.findOneBy({ id });
            if (!trip) {
                return (0, responseHandler_1.responseHandler)(404, 'Trip Not Found');
            }
            await this.tripRepository.softDelete(id);
            return (0, responseHandler_1.responseHandler)(200, 'Trip soft deleted successfully');
        }
        catch (error) {
            console.error('Error deleting Trip:', error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, "Trip Not Found");
            }
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async getTripCode() {
        let trip_code;
        let isCodeUnique = false;
        while (!isCodeUnique) {
            trip_code = this.generateTripCode();
            const existingTrip = await this.tripRepository.findOne({ where: { trip_code } });
            if (!existingTrip) {
                isCodeUnique = true;
            }
        }
        return trip_code;
    }
    generateTripCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '#PT';
        for (let i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
};
exports.TripService = TripService;
exports.TripService = TripService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TripService);
//# sourceMappingURL=trip.service.js.map