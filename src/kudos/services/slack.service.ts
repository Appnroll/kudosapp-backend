import {HttpService, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "../model/user.entity";
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class SlackService {


    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
                private readonly httpService: HttpService) {
    }

    async fetchAvatars() {
        const req: any = await this.httpService.get(`https://slack.com/api/users.list?token=${process.env.SLACK_OAUTH_TOKEN}`).toPromise()
        const users = req.data.members.map(el => ({
            name: el.name,
            image_24: el.profile.image_24,
            image_32: el.profile.image_32,
            image_48: el.profile.image_48,
            image_72: el.profile.image_72,
            image_192: el.profile.image_192
        }))
        const usersEntities = this.userRepository.create(users)
        await this.userRepository.clear();
        await this.userRepository.save(usersEntities)
    }

}
