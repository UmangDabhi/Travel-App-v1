import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(authDto: CreateAuthDto): Promise<any>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<any>;
}
