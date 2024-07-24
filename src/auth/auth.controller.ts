import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("/login")
  signIn(@Body() authDto:CreateAuthDto){
    return this.authService.signIn(authDto.email,authDto.password);
  }
  @HttpCode(HttpStatus.OK)
  @Post("/change-password")
  changePassword(@Body() changePasswordDto:ChangePasswordDto){
    return this.authService.changePassword(changePasswordDto.email,changePasswordDto.old_password,changePasswordDto.new_password);
  }
  
}
