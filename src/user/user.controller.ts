import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Post('create_user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('get_users/:role')
  findAll(@Param('role') role: number) {
    return this.userService.findAll(Number(role));
  }

  @UseGuards(AuthGuard)
  @Get('get_one_user/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  @UseGuards(AuthGuard)
  @Get('get_by_email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Patch('update_user/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete_user/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
