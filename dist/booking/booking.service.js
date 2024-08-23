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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const typeorm_2 = require("typeorm");
const traveller_entity_1 = require("../traveller/entities/traveller.entity");
const user_entity_1 = require("../user/entities/user.entity");
const trip_entity_1 = require("../trip/entities/trip.entity");
const responseHandler_1 = require("../Utils/responseHandler");
let BookingService = class BookingService {
    constructor(bookingRepository, travellerRepository, userRepository, tripRepository) {
        this.bookingRepository = bookingRepository;
        this.travellerRepository = travellerRepository;
        this.userRepository = userRepository;
        this.tripRepository = tripRepository;
    }
    async create(createBookingDto) {
        try {
            const { traveller, parent_id, trip_id, ...bookingData } = createBookingDto;
            let newTraveller = null;
            if (traveller) {
                const existingTraveller = await this.travellerRepository.findOne({
                    where: {
                        phone_no: parseInt(traveller.phone_no),
                        firstname: traveller.firstname,
                        lastname: traveller.lastname,
                    }
                });
                if (existingTraveller) {
                    newTraveller = existingTraveller;
                }
                else {
                    newTraveller = this.travellerRepository.create({
                        firstname: traveller.firstname,
                        lastname: traveller.lastname,
                        phone_no: parseInt(traveller.phone_no),
                        ...traveller.secondary_phone_no && { secondary_phone_no: parseInt(traveller.secondary_phone_no) },
                        ...traveller.email && { email: traveller.email }
                    });
                    await this.travellerRepository.save(newTraveller);
                }
            }
            const user = await this.userRepository.findOneBy({ id: parent_id });
            const trip = await this.tripRepository.findOneBy({ id: trip_id });
            if (!user || !trip) {
                throw new Error('Invalid user or trip');
            }
            const newBooking = this.bookingRepository.create({
                ...bookingData,
                user,
                trip,
                traveller: newTraveller
            });
            await this.bookingRepository.save(newBooking);
            return (0, responseHandler_1.responseHandler)(201, "Booking Successful", newBooking);
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async findAll(findBookingDto) {
        try {
            const bookings = await this.bookingRepository.find({ where: { user: { id: findBookingDto.parent_id } }, order: { created_at: 'DESC', }, });
            const allBookings = bookings.map(booking => ({
                ...booking,
                total_amount: booking.total_amount,
                pending_amount: booking.pending_amount,
            }));
            return (0, responseHandler_1.responseHandler)(200, 'Bookings fetched successfully', allBookings);
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
    async findOne(id) {
        try {
            let booking = await this.bookingRepository.findOneBy({ id });
            if (!booking) {
                return (0, responseHandler_1.responseHandler)(404, 'User Not Found');
            }
            booking = {
                ...booking,
                total_amount: booking.total_amount,
                pending_amount: booking.pending_amount,
            };
            return (0, responseHandler_1.responseHandler)(200, 'Booking fetched successfully', booking);
        }
        catch (error) {
            console.error(error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, 'Booking Not Found');
            }
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
    async update(id, updateBookingDto) {
        try {
            const { traveller, parent_id, trip_id, ...bookingData } = updateBookingDto;
            const existingBooking = await this.bookingRepository.findOne({ where: { id } });
            if (!existingBooking) {
                return (0, responseHandler_1.responseHandler)(404, 'Booking Not Found');
            }
            let updatedTraveller = null;
            if (traveller && traveller.id) {
                const existingTraveller = await this.travellerRepository.findOne({ where: { id: traveller.id } });
                if (!existingTraveller) {
                    return (0, responseHandler_1.responseHandler)(404, 'Traveller Not Found');
                }
                await this.travellerRepository.update(traveller.id, {
                    firstname: traveller.firstname,
                    lastname: traveller.lastname,
                    phone_no: parseInt(traveller.phone_no),
                    ...traveller.secondary_phone_no && { secondary_phone_no: parseInt(traveller.secondary_phone_no) },
                    ...traveller.email && { email: traveller.email }
                });
                updatedTraveller = await this.travellerRepository.findOne({ where: { id: traveller.id } });
            }
            else {
                return (0, responseHandler_1.responseHandler)(400, 'Invalid Traveller Data');
            }
            const user = await this.userRepository.findOne({ where: { id: parent_id } });
            const trip = await this.tripRepository.findOne({ where: { id: trip_id } });
            if (!user || !trip) {
                return (0, responseHandler_1.responseHandler)(400, 'Invalid user or trip');
            }
            await this.bookingRepository.update(id, {
                ...bookingData,
                user,
                trip,
                traveller: updatedTraveller || existingBooking.traveller,
            });
            return (0, responseHandler_1.responseHandler)(200, 'Booking updated successfully');
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
    async remove(id) {
        try {
            const booking = await this.bookingRepository.findOneBy({ id });
            if (!booking) {
                return (0, responseHandler_1.responseHandler)(404, 'Booking Not Found');
            }
            const deletedBooking = await this.bookingRepository.softDelete(id);
            return (0, responseHandler_1.responseHandler)(200, 'Booking Deleted Successfully', deletedBooking);
        }
        catch (error) {
            console.error(error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, 'User Not Found');
            }
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async findTripInfo(data) {
        try {
            const trip = await this.tripRepository.findOne({ where: { trip_code: data.trip_code } });
            const bookings = await this.bookingRepository.find({ where: { trip: { id: trip.id } } });
            const travellersList = bookings.map(booking => ({
                id: booking.id,
                total_pax: booking.total_pax,
                pending_amount: booking.pending_amount,
                payment_done: booking.payment_done,
                firstname: booking.traveller.firstname,
                lastname: booking.traveller.lastname,
                phone_no: booking.traveller.phone_no,
                secondary_phone_no: booking.traveller.secondary_phone_no,
                email: booking.traveller.email,
            }));
            return (0, responseHandler_1.responseHandler)(200, 'message to be changes', { travellersList });
        }
        catch (error) {
            console.error(error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, 'User Not Found');
            }
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(traveller_entity_1.Traveller)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingService);
//# sourceMappingURL=booking.service.js.map