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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("typeorm");
const responseHandler_1 = require("../Utils/responseHandler");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto) {
        try {
            const newUser = await this.userRepository.save(createUserDto);
            return (0, responseHandler_1.responseHandler)(201, 'User created successfully', newUser);
        }
        catch (error) {
            console.error('Error creating user:', error);
            if (error.code === '23505') {
                return (0, responseHandler_1.responseHandler)(409, 'Email Already Exists');
            }
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
    async findAll(userRole) {
        try {
            let users;
            if (userRole === 1) {
                users = await this.userRepository.find({
                    where: { role: (0, typeorm_2.Not)(1) },
                    order: { created_at: 'DESC' },
                });
            }
            else if (userRole === 2) {
                users = await this.userRepository.find({
                    where: { role: (0, typeorm_2.Not)((0, typeorm_2.In)([1, 2])) },
                    order: { created_at: 'DESC' },
                });
            }
            return (0, responseHandler_1.responseHandler)(200, 'Users fetched successfully', users);
        }
        catch (error) {
            console.error('Error fetching users:', error);
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
    async findOne(id) {
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                return (0, responseHandler_1.responseHandler)(404, 'User Not Found');
            }
            return (0, responseHandler_1.responseHandler)(200, 'User fetched successfully', user);
        }
        catch (error) {
            console.error('Error fetching user:', error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, 'User Not Found');
            }
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
    async findOneByEmail(email) {
        try {
            const user = await this.userRepository.findOneBy({ email });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return (0, responseHandler_1.responseHandler)(200, 'User fetched successfully', user);
        }
        catch (error) {
            console.error('Error fetching user by email:', error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, 'User Not Found');
            }
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
    async update(id, updateUserDto) {
        try {
            await this.userRepository.update(id, updateUserDto);
            return (0, responseHandler_1.responseHandler)(200, 'User updated successfully');
        }
        catch (error) {
            console.error('Error updating user:', error);
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
    async remove(id) {
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                return (0, responseHandler_1.responseHandler)(404, 'User Not Found');
            }
            await this.userRepository.softDelete(id);
            return (0, responseHandler_1.responseHandler)(200, 'User soft deleted successfully');
        }
        catch (error) {
            console.error('Error deleting user:', error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, 'User Not Found');
            }
            return (0, responseHandler_1.responseHandler)(500, 'Internal Server Error');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map