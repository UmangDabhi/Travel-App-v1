import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, In, Like, Not, Raw, Repository } from 'typeorm';
import { responseHandler } from 'src/Utils/responseHandler';
import * as fs from 'fs';
import { join, extname } from 'path';
@Injectable()
export class UserService {

  private readonly uploadPath = join(__dirname, '..', '..', 'public', 'uploads', 'qrFolder');

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    console.log(this.uploadPath);
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const newUser = this.userRepository.create(createUserDto);
      newUser.emp_code = await this.getEmpCode();
      this.userRepository.save(newUser);
      return responseHandler(201, 'User created successfully', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === '23505') {
        return responseHandler(409, 'Email Already Exists');
      }
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async findAll(userRole: number, page: number = 1, limit: number = 10, searchQuery?: string): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      // Base query options
      let queryOptions: any = {
        where: {},
        order: { created_at: 'DESC' },
        skip,
        take: limit,
      };

      // Add role-based filtering
      if (userRole === 1) {
        queryOptions.where.role = Not(1);
      } else if (userRole === 2) {
        queryOptions.where.role = Not(In([1, 2]));
      }

      // Add search query if provided
      if (searchQuery) {
        queryOptions.where = [
          { role: queryOptions.where.role, name: ILike(`%${searchQuery}%`) },
          { role: queryOptions.where.role, email: ILike(`%${searchQuery}%`) },
          { role: queryOptions.where.role, phone_number: Raw((text) => `CAST(${text} as varchar) ILike '%${searchQuery}%'`) },
          { role: queryOptions.where.role, emp_code: ILike(`%${searchQuery}%`) },
        ];
      }

      // Fetch users with pagination and optional search query
      const [users, total] = await this.userRepository.findAndCount(queryOptions);

      // Calculate total pages
      const totalPages = Math.ceil(total / limit);

      return responseHandler(200, 'Users fetched successfully', { users, total, totalPages, currentPage: page });
    } catch (error) {
      console.error('Error fetching users:', error);
      return responseHandler(500, 'Internal Server Error');
    }
  }


  async findOne(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return responseHandler(404, 'User Not Found');
      }
      return responseHandler(200, 'User fetched successfully', user);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, 'User Not Found');
      }
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async findOneByEmail(email: string): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return responseHandler(200, 'User fetched successfully', user);
    } catch (error) {
      console.error('Error fetching user by email:', error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, 'User Not Found');
      }
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      await this.userRepository.update(id, updateUserDto);
      return responseHandler(200, 'User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        return responseHandler(404, 'User Not Found');
      }
      await this.userRepository.softDelete(id);
      return responseHandler(200, 'User soft deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error instanceof NotFoundException) {
        return responseHandler(404, 'User Not Found');
      }
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const fileName = 'qr_code';
    const fileExt = extname(file.originalname); // Get the extension of the uploaded file
    const newFilePath = join(this.uploadPath, `${fileName}${fileExt}`);

    if (fs.existsSync(this.uploadPath)) {
      fs.rmSync(this.uploadPath, { recursive: true });
    }

    fs.mkdirSync(this.uploadPath, { recursive: true });

    try {
      if (file.buffer) {
        fs.writeFileSync(newFilePath, file.buffer);
      }
      else if (file.path) {
        fs.renameSync(file.path, newFilePath);
      } else {
        return responseHandler(200, 'File data is not available');
      }
    } catch (error) {
      return responseHandler(200, `Failed to save file`);
    }


    return responseHandler(200, `File uploaded successfully as ${fileName}${fileExt}`);
  }

  async getQRFile(): Promise<any> {
    const extensions = ['png', 'jpg', 'jpeg'];
    let fileName = "qr_code";

    for (const ext of extensions) {
      const possibleFilePath = join(this.uploadPath, `${fileName}.${ext}`);
      if (fs.existsSync(possibleFilePath)) {
        const file_url = `${process.env.BASE_URL}/uploads/qrFolder/${fileName}.${ext}`
        return responseHandler(200, `File Found successfully`, file_url);
      }
    }
    return responseHandler(404, `File Not Found`);
  }


  private async getEmpCode(): Promise<string> {
    let emp_code: string;
    let isCodeUnique = false;

    while (!isCodeUnique) {
      emp_code = this.generateEmpCode();

      const existingUser = await this.userRepository.findOne({ where: { emp_code } });

      if (!existingUser) {
        isCodeUnique = true;
      }
    }
    return emp_code;
  }
  private generateEmpCode(): string {
    const characters = '0123456789';
    let result = '#EMP';
    for (let i = 0; i < 3; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
