import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(userRole: number): Promise<any>;
    findOne(id: number): Promise<any>;
    findOneByEmail(email: string): Promise<any>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: number): Promise<any>;
}
