import {Injectable} from '@nestjs/common';
import {Kudos} from "../model/kudos.entity";
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {UserService} from "./user.service";
import {AvatarDto} from "../dto/avatar.dto";
import {User} from "../model/user.entity";

@Injectable()
export class KudosService {

    constructor(@InjectRepository(Kudos) private readonly kudosRepository: Repository<Kudos>,
                private readonly userService: UserService) {
    }

    async getAll(): Promise<Kudos[]> {
        return await this.kudosRepository.find();
    }

    // async getAllWithAvatars() {
    //     const kudos = await this.getAll();
    //     const users = await this.userService.getAll();
    //     return kudos.map((r: Kudos) => {
    //         const fromUser = users.find(el => el.name === r.from || r.from === `@${el.name}`)
    //         const givenToUser = users.find(el => el.name === r.givenTo || r.givenTo === `@${el.name}`)
    //         let fromAvatar: AvatarDto, givenToAvatar: AvatarDto;
    //         if (fromUser) {
    //             fromAvatar = {
    //                 image_24: fromUser.image_24,
    //                 image_32: fromUser.image_32,
    //                 image_48: fromUser.image_48,
    //                 image_72: fromUser.image_72,
    //                 image_192: fromUser.image_192
    //             }
    //         }
    //
    //         if (givenToUser) {
    //             givenToAvatar = {
    //                 image_24: givenToUser.image_24,
    //                 image_32: givenToUser.image_32,
    //                 image_48: givenToUser.image_48,
    //                 image_72: givenToUser.image_72,
    //                 image_192: givenToUser.image_192
    //             }
    //         }
    //         return {
    //             id: r.id,
    //             from: r.from,
    //             givenTo: r.givenTo,
    //             description: r.description,
    //             fromAvatar: fromAvatar,
    //             givenToAvatar: givenToAvatar
    //         }
    //     })
    // }

    async getRankings(): Promise<{ givenTo: string, totalPoints: number }[]> {
        return await this.kudosRepository.createQueryBuilder("Kudos")
            .select('COUNT(*)', 'totalPoints')
            .addSelect(['\"givenTo\"'])
            .addGroupBy('\"givenTo\"')
            .getRawMany();
    }

    async getFrom(): Promise<{ quantity: number, year: number, month: string, from: string }[]> {
        return await this.kudosRepository.createQueryBuilder("Kudos")
            .select('COUNT(*)', 'quantity')
            .addSelect(`extract(year from "createdAt")`, 'year')
            .addSelect(`to_char("createdAt", 'Mon')`, 'month')
            .addSelect([`"from"`])
            .addGroupBy(`"from"`)
            .addGroupBy('month')
            .addGroupBy('year')
            .addOrderBy(`"from"`, "ASC")
            .getRawMany();
    }

    async getGiven(): Promise<{ quantity: number, year: number, month: string, givenTo: string }[]> {
        return await this.kudosRepository.createQueryBuilder("Kudos")
            .select('COUNT(*)', 'quantity')
            .addSelect(`extract(year from "createdAt")`, 'year')
            .addSelect(`to_char("createdAt", 'Mon')`, 'month')
            .addSelect([`"givenTo"`])
            .addGroupBy(`"givenTo"`)
            .addGroupBy('month')
            .addGroupBy('year')
            .addOrderBy(`"givenTo"`, "ASC")
            .getRawMany();
    }

    async saveKudos(description: string, from: User, users: User[]): Promise<Kudos> {
        const kudo = this.kudosRepository.create()
        kudo.description = description
        kudo.users = [...users]
        kudo.from = from
        return await this.kudosRepository.save(kudo);
    }

    removeUnnecesaryAt(usersNames: string[]) {
        return usersNames.map(el => {
            return el.charAt(0) === `@` ? el.substring(1) : el;
        })
    }
}
