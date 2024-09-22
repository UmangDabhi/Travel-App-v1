import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, In, Like, Not, Raw, Repository } from 'typeorm';
import { responseHandler } from 'src/Utils/responseHandler';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

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
