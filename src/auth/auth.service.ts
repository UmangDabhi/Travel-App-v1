import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { responseHandler } from 'src/Utils/responseHandler';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) { }

  async signIn(email: string, password: string) {
    try {
      const response = await this.userService.findOneByEmail(email);
      const user = response.result;

      if (!user || user.password !== password) {
        return responseHandler(404, 'Wrong Password');
      }

      const payload = { id: user.id, email: user.email, role: user.role };
      const access_token = await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: "2d", // Token expires in 2 days
      });

      return responseHandler(200, "Authentication Successful", { access_token, user });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return responseHandler(404, error.message);
      }
      return responseHandler(500, "Internal Server Error");
    }
  }
  async changePassword(email: string, old_password: string, new_password: string) {
    try {
      const response = await this.userService.findOneByEmail(email);
      const user = response.result;

      if (user.password !== old_password)
        return responseHandler(401, 'Old password is incorrect');

      if (user.password === new_password)
        return responseHandler(401, 'New password cannot be the same as the old password');

      user.is_sys_password = false;
      user.password = new_password;
      await this.userService.update(user.id, user);
      return responseHandler(200, 'Password changed successfully');
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, error.message);
      }
      return responseHandler(500, "Internal Server Error");
    }

  }
}