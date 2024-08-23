"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const trip_module_1 = require("./trip/trip.module");
const user_module_1 = require("./user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const booking_module_1 = require("./booking/booking.module");
const traveller_module_1 = require("./traveller/traveller.module");
const config_1 = require("@nestjs/config");
let ConfigLoggerService = class ConfigLoggerService {
    onModuleInit() {
        console.log({
            POSTGRES_HOST: process.env.POSTGRES_HOST,
            POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT, 10),
            POSTGRES_USER: process.env.POSTGRES_USER,
            POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
            POSTGRES_DB: process.env.POSTGRES_DB,
        });
    }
};
ConfigLoggerService = __decorate([
    (0, common_1.Injectable)()
], ConfigLoggerService);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            trip_module_1.TripModule,
            user_module_1.UserModule,
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT, 10),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
            auth_module_1.AuthModule,
            booking_module_1.BookingModule,
            traveller_module_1.TravellerModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, ConfigLoggerService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map