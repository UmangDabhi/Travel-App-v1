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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const responseHandler_1 = require("../Utils/responseHandler");
const constants_1 = require("./constants");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async signIn(email, password) {
        try {
            const response = await this.userService.findOneByEmail(email);
            const user = response.result;
            if (!user || user.password !== password) {
                return (0, responseHandler_1.responseHandler)(404, 'Wrong Password');
            }
            const payload = { id: user.id, email: user.email };
            const access_token = await this.jwtService.signAsync(payload, {
                secret: constants_1.jwtConstants.secret,
                expiresIn: "2d",
            });
            return (0, responseHandler_1.responseHandler)(200, "Authentication Successful", { access_token, user });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, error.message);
            }
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
    async changePassword(email, old_password, new_password) {
        try {
            const response = await this.userService.findOneByEmail(email);
            const user = response.result;
            if (user.password !== old_password)
                return (0, responseHandler_1.responseHandler)(401, 'Old password is incorrect');
            if (user.password === new_password)
                return (0, responseHandler_1.responseHandler)(401, 'New password cannot be the same as the old password');
            user.is_sys_password = false;
            user.password = new_password;
            await this.userService.update(user.id, user);
            return (0, responseHandler_1.responseHandler)(200, 'Password changed successfully');
        }
        catch (error) {
            console.error(error);
            if (error instanceof common_1.NotFoundException) {
                return (0, responseHandler_1.responseHandler)(404, error.message);
            }
            return (0, responseHandler_1.responseHandler)(500, "Internal Server Error");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map