import {Injectable} from '@nestjs/common';
import {User} from "../model/user.entity";
import {FindConditions, In, Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {AvatarDto} from "../dto/avatar.dto";

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

    async findByUsersName(users: string[]) {
        if(users.length == 0) return [];
        return await this.userRepository.find({
            where: {
                name: In(this.removeUnnecessaryAt(users))
            }
        })
    }

    mapAvatarToAvatarDto(forUser: string, users: User[]): AvatarDto {
        const user: User = users.find(u => u.name == forUser)
        return {
            image_24: user.image_24,
            image_32: user.image_32,
            image_48: user.image_48,
            image_72: user.image_72,
            image_192: user.image_192,
        } as AvatarDto
    }

    removeUnnecessaryAt(usersNames: string[]) {
        return usersNames.map(el => {
            return el.charAt(0) === `@` ? el.substring(1) : el;
        })
    }


}
