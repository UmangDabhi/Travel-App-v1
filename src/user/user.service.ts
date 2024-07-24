import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { responseHandler } from 'src/Utils/responseHandler';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const newUser = await this.userRepository.save(createUserDto);
      return responseHandler(201, 'User created successfully', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === '23505') {
        return responseHandler(409,'Email Already Exists');
      }
      return responseHandler(500,'Internal Server Error');
    }
  }

  async findAll(): Promise<any> {
    try {
      const users = await this.userRepository.find();
      return responseHandler(200, 'Users fetched successfully', users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return responseHandler(500, 'Internal Server Error');
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({id});
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
      const user = await this.userRepository.findOneBy({id});
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
}
