import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { responseHandler } from 'src/Utils/responseHandler';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) { }

  async signIn(email: string, password: string) {
    try {
      const response = await this.userService.findOneByEmail(email);
      const user = response.result;
      if (user?.password !== password) {
        return responseHandler(404, 'Wrong Password');
      }
      const payload = { id: user.id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);
      return responseHandler(200, "Authentication Successful", { access_token, user });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return responseHandler(404, error.message);
      }
      return responseHandler(500, "Internal Server Error")
    }

  }
  async changePassword(email: string, old_password: string, new_password: string) {
    try {
      const response = await this.userService.findOneByEmail(email);
      const user = response.result;
      if (old_password !== new_password)
        throw new UnauthorizedException();
      if (user.password !== old_password)
        throw new UnauthorizedException();
      user.is_sys_password = false;
      user.password = new_password;
      await this.userService.update(user.id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return responseHandler(404, error.message);
      }
      return responseHandler(500, "Internal Server Error");
    }

  }
}