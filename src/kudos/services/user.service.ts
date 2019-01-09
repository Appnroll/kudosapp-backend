import {Injectable} from '@nestjs/common';
import {User} from "../model/user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    }

    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }
}
