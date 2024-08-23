"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravellerService = void 0;
const common_1 = require("@nestjs/common");
let TravellerService = class TravellerService {
    create(createTravellerDto) {
        try {
        }
        catch (error) {
        }
        return 'This action adds a new traveller';
    }
    findAll() {
        return `This action returns all traveller`;
    }
    findOne(id) {
        return `This action returns a #${id} traveller`;
    }
    update(id, updateTravellerDto) {
        return `This action updates a #${id} traveller`;
    }
    remove(id) {
        return `This action removes a #${id} traveller`;
    }
};
exports.TravellerService = TravellerService;
exports.TravellerService = TravellerService = __decorate([
    (0, common_1.Injectable)()
], TravellerService);
//# sourceMappingURL=traveller.service.js.map