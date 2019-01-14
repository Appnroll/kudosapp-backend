import {Injectable} from '@nestjs/common';
import {Kudos} from "../model/kudos.entity";
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {User} from "../model/user.entity";
import {UserKudosEntity} from "../model/user-kudos.entity";
import {groupBy, map} from "lodash";
import {AvatarDto} from "../dto/avatar.dto";

@Injectable()
export class KudosService {

    constructor(@InjectRepository(Kudos) private readonly kudosRepository: Repository<Kudos>,
                @InjectRepository(UserKudosEntity) private readonly userKudosRepository: Repository<UserKudosEntity>) {
    }

    async getAllWithAvatars() {
        const userKudos = await this.userKudosRepository
            .createQueryBuilder('userKudos')
            .leftJoinAndSelect('userKudos.user', 'users')
            .leftJoinAndSelect('userKudos.kudos', 'kudos')
            .leftJoinAndSelect('userKudos.from', 'fromUser')
            .getRawMany()

        const groupedKudos = groupBy(userKudos, el => el.userKudos_kudosId);
        const getUserAvatar = (userObj) => ({
            image_24: userObj.users_image_24,
            image_32: userObj.users_image_32,
            image_48: userObj.users_image_48,
            image_72: userObj.users_image_72,
            image_192: userObj.users_image_192
        } as AvatarDto)

        return map(groupedKudos, (value) => {
            const kudosProperties = value[0]
            return {
                description: kudosProperties.kudos_description,
                from: kudosProperties.fromUser_name,
                id: kudosProperties.kudos_id,
                givenTo: value.map(val => val.users_name),
                fromAvatar: {
                    image_24: kudosProperties.fromUser_image_24,
                    image_32: kudosProperties.fromUser_image_32,
                    image_48: kudosProperties.fromUser_image_48,
                    image_72: kudosProperties.fromUser_image_72,
                    image_192: kudosProperties.fromUser_image_192
                } as AvatarDto,
                givenToAvatar: value.map(getUserAvatar)
            }
        })
    }

    async getRankings(): Promise<{ totalPoints: number, name: string }[]> {
        return await this.userKudosRepository.createQueryBuilder("userKudos")
            .select('COUNT(*)', 'totalPoints')
            .leftJoin('userKudos.user', 'users')
            .addSelect([`"userKudos"."userId"`])
            .addSelect([`"users"."name"`])
            .addGroupBy(`"userKudos"."userId"`)
            .addGroupBy(`"users"."name"`)
            .getRawMany();
    }

    async getFrom(): Promise<{ quantity: number, year: number, month: string, name: string }[]> {
        return await this.userKudosRepository.createQueryBuilder("userKudos")
            .select('COUNT(*)', 'quantity')
            .leftJoin('userKudos.from', 'users')
            .addSelect(`extract(year from "userKudos"."createdAt")`, 'year')
            .addSelect(`to_char("userKudos"."createdAt", 'Mon')`, 'month')
            .addSelect([`"users"."name"`])
            .addGroupBy(`"users"."name"`)
            .addGroupBy('month')
            .addGroupBy('year')
            .addOrderBy(`"users"."name"`, "ASC")
            .getRawMany();
    }

    async getGiven(): Promise<{ quantity: number, year: number, month: string, name: string }[]> {
        return await this.userKudosRepository.createQueryBuilder("userKudos")
            .select('COUNT(*)', 'quantity')
            .leftJoin('userKudos.user', 'users')
            .addSelect(`extract(year from "userKudos"."createdAt")`, 'year')
            .addSelect(`to_char("userKudos"."createdAt", 'Mon')`, 'month')
            .addSelect([`"users"."name"`])
            .addGroupBy(`"users"."name"`)
            .addGroupBy('month')
            .addGroupBy('year')
            .addOrderBy(`"users"."name"`, "ASC")
            .getRawMany();
    }

    async saveKudos(description: string, from: User, users: User[]): Promise<UserKudosEntity[]> {
        const kudo = this.kudosRepository.create()
        kudo.description = description;

        await this.kudosRepository.save(kudo);

        const userKudos = users.map(user => {
            const userKudos = this.userKudosRepository.create();
            userKudos.user = user;
            userKudos.kudos = kudo;
            userKudos.from = from;
            return userKudos;
        })

        kudo.userKudos = userKudos;
        from.userKudos = userKudos;

        return await this.userKudosRepository.save(userKudos);
    }
}
