import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';

@Controller('user')
export class UserController {
  // private readonly 

  constructor(private readonly userService: UserService,

  ) { }

  @UseGuards(AuthGuard)
  @Post('create_user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @UseGuards(AuthGuard)
  @Get('get_users/:role')
  findAll(
    @Param('role') role: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('searchQuery') searchQuery?: string
  ) {
    return this.userService.findAll(Number(role), Number(page), Number(limit), searchQuery);
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

  // @UseGuards(AuthGuard)
  @Get('get_qr_code')
  getQRFile() {
    return this.userService.getQRFile();
  }

  // @UseGuards(AuthGuard)
  @Post('upload_qr_code')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = path.join(__dirname, '..', 'uploads', 'qrFolder');
          // Delete the folder and recreate it before storing the file
          if (fs.existsSync(uploadPath)) {
            // Remove folder and its contents
            fs.rmSync(uploadPath, { recursive: true });
          }
          // Recreate the folder
          fs.mkdirSync(uploadPath, { recursive: true });

          callback(null, uploadPath); // Store the file in the recreated folder
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = 'qr_code'; // File name to be qr_code
          const fileExt = extname(file.originalname); // Get file extension (e.g., .png, .jpg)
          callback(null, `${uniqueSuffix}${fileExt}`); // Save file as 'qr_code.extension'
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // You can perform any additional logic here
    return { message: `File uploaded successfully as qr_code${extname(file.originalname)}` };
  }
}
