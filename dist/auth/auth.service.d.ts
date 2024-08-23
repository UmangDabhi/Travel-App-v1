import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    signIn(email: string, password: string): Promise<any>;
    changePassword(email: string, old_password: string, new_password: string): Promise<any>;
}
