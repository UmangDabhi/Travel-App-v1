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
exports.TravellerController = void 0;
const common_1 = require("@nestjs/common");
const traveller_service_1 = require("./traveller.service");
const create_traveller_dto_1 = require("./dto/create-traveller.dto");
const update_traveller_dto_1 = require("./dto/update-traveller.dto");
let TravellerController = class TravellerController {
    constructor(travellerService) {
        this.travellerService = travellerService;
    }
    create(createTravellerDto) {
        return this.travellerService.create(createTravellerDto);
    }
    findAll() {
        return this.travellerService.findAll();
    }
    findOne(id) {
        return this.travellerService.findOne(+id);
    }
    update(id, updateTravellerDto) {
        return this.travellerService.update(+id, updateTravellerDto);
    }
    remove(id) {
        return this.travellerService.remove(+id);
    }
};
exports.TravellerController = TravellerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_traveller_dto_1.CreateTravellerDto]),
    __metadata("design:returntype", void 0)
], TravellerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TravellerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TravellerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_traveller_dto_1.UpdateTravellerDto]),
    __metadata("design:returntype", void 0)
], TravellerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TravellerController.prototype, "remove", null);
exports.TravellerController = TravellerController = __decorate([
    (0, common_1.Controller)('traveller'),
    __metadata("design:paramtypes", [traveller_service_1.TravellerService])
], TravellerController);
//# sourceMappingURL=traveller.controller.js.map