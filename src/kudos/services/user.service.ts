import {Injectable} from '@nestjs/common';
import {User} from "../model/user.entity";
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    }

    async checkIfUserExist(username: string) {
        const hasAt = username.indexOf('\@')
        if (hasAt >= 0) {
            username = username.substring(1);
        }
        return await this.userRepository.findOne({name: username})
    }

    async findUserBySlackId(slackId: string) {
        return await this.userRepository.findOne({slackId: slackId});
    }

    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }
}
