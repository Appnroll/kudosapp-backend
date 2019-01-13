import {Injectable} from '@nestjs/common';
import {User} from "../model/user.entity";
import {FindConditions, In, Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    }

    async findUserBySlackId(slackId: string) {
        return await this.userRepository.findOne({slackId: slackId});
    }

    async findByName(name: string) {
        return await this.userRepository.findOne({name: name.charAt(0) === '@' ? name.substring(1) : name});
    }

    async findBy(findOneOptions: FindConditions<User>) {
        return await this.userRepository.findOne(findOneOptions);
    }

    async findByUsersName(users: string[]) {
        return await this.userRepository.find({
            where: {
                name: In(this.removeUnnecessaryAt(users))
            }
        })
    }

    async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    removeUnnecessaryAt(usersNames: string[]) {
        return usersNames.map(el => {
            return el.charAt(0) === `@` ? el.substring(1) : el;
        })
    }


}
