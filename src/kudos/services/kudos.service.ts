import {Injectable} from '@nestjs/common';
import {Kudos} from "../model/kudos.entity";
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {User} from "../model/user.entity";
import {UserKudosEntity} from "../model/user-kudos.entity";
import {groupBy, map} from "lodash";
import {AvatarDto} from "../dto/avatar.dto";
import {PaginationDto} from "../dto/pagination.dto";
import {KudosDto} from "../dto/kudos.dto";
import {PageDto} from "../dto/page.dto";
import {DateService} from "./date.service";

@Injectable()
export class KudosService {

  constructor(@InjectRepository(Kudos) private readonly kudosRepository: Repository<Kudos>,
              @InjectRepository(UserKudosEntity) private readonly userKudosRepository: Repository<UserKudosEntity>,
              private dateService: DateService) {
  }

  async getAllPaginated(pagination: PaginationDto) {
    const userKudos = await this.fetchKudosWithUser(pagination)

    const groupedKudos = groupBy(userKudos, el => el.userKudos_kudosId);
    const getUserAvatar = (userObj) => ({
      image_24: userObj.users_image_24,
      image_32: userObj.users_image_32,
      image_48: userObj.users_image_48,
      image_72: userObj.users_image_72,
      image_192: userObj.users_image_192
    } as AvatarDto)


    const userKudosAvatars = map(groupedKudos, (value) => {
      const kudosProperties = value[0]
      return {
        description: kudosProperties.kudos_description,
        from: {
          avatar: {
            image_24: kudosProperties.fromUser_image_24,
            image_32: kudosProperties.fromUser_image_32,
            image_48: kudosProperties.fromUser_image_48,
            image_72: kudosProperties.fromUser_image_72,
            image_192: kudosProperties.fromUser_image_192
          } as AvatarDto,
          name: kudosProperties.fromUser_name
        },
        id: kudosProperties.kudos_id,
        givenTo: value.map(val => ({
            name: val.users_name,
            avatar: getUserAvatar(val)
          })
        )
      }
    })
    const hasNext = userKudosAvatars.length > pagination.size
    if (hasNext) {
      userKudosAvatars.shift();
    }
    return {
      data: userKudosAvatars,
      size: userKudosAvatars.length,
      page: pagination.page,
      hasNext: hasNext
    } as PageDto<KudosDto>
  }

  async fetchKudosWithUser(pagination: PaginationDto) {
    const kudos = await this.userKudosRepository.createQueryBuilder('userKudos')
      .select("count(*)")
      .addSelect(`"userKudos"."kudosId"`)
      .addSelect(`"userKudos"."historyCreatedAt"`)
      .groupBy(`"userKudos"."kudosId"`)
      .addGroupBy(`"userKudos"."historyCreatedAt"`)
      .take(Number(pagination.size) + 1)
      .skip(Number(pagination.size * pagination.page))
      .orderBy(`"userKudos"."historyCreatedAt"`, "DESC")
      .getRawMany()

    const kudosId = kudos.map(el => el.kudosId);
    if (kudosId.length == 0) return [];
    return await this.userKudosRepository
      .createQueryBuilder('userKudos')
      .leftJoinAndSelect('userKudos.user', 'users')
      .leftJoinAndSelect('userKudos.kudos', 'kudos')
      .leftJoinAndSelect('userKudos.from', 'fromUser')
      .where(`userKudos.kudos IN (${[...kudosId]})`,)
      .getRawMany()
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

  async getFromAll(): Promise<{ quantity: number, year: number, month: string, name: string }[]> {
    return await this.userKudosRepository.createQueryBuilder("userKudos")
      .select('COUNT(*)', 'quantity')
      .leftJoin('userKudos.from', 'users')
      .addSelect(`extract(year from "userKudos"."historyCreatedAt")`, 'year')
      .addSelect(`to_char("userKudos"."historyCreatedAt", 'Mon')`, 'month')
      .addSelect([`"users"."name"`])
      .addGroupBy(`"users"."name"`)
      .addGroupBy('month')
      .addGroupBy('year')
      .addOrderBy(`"users"."name"`, "ASC")
      .getRawMany();
  }

  async getFrom(year: number, month: number): Promise<{ quantity: number, year: number, month: string, name: string }[]> {
    const monthShorten = this.dateService.getMonthShorten(month)
    return await this.userKudosRepository.createQueryBuilder("userKudos")
      .select('COUNT(*)', 'quantity')
      .leftJoin('userKudos.from', 'users')
      .addSelect(`extract(year from "userKudos"."historyCreatedAt")`, 'year')
      .addSelect(`to_char("userKudos"."historyCreatedAt", 'Mon')`, 'month')
      .addSelect([`"users"."name"`])
      .addGroupBy(`"users"."name"`)
      .addGroupBy('month')
      .addGroupBy('year')
      .addOrderBy(`"users"."name"`, "ASC")
      .where(`extract(year from "userKudos"."historyCreatedAt") = :year`, {year})
      .andWhere(`to_char("userKudos"."historyCreatedAt", 'Mon') = :month`, {month: monthShorten})
      .getRawMany();
  }

  async getGiven(year: number, month: number): Promise<{ quantity: number, year: number, month: string, name: string }[]> {
    const monthShorten = this.dateService.getMonthShorten(month)
    return await this.userKudosRepository.createQueryBuilder("userKudos")
      .select('COUNT(*)', 'quantity')
      .leftJoin('userKudos.user', 'users')
      .addSelect(`extract(year from "userKudos"."historyCreatedAt")`, 'year')
      .addSelect(`to_char("userKudos"."historyCreatedAt", 'Mon')`, 'month')
      .addSelect([`"users"."name"`])
      .addGroupBy(`"users"."name"`)
      .addGroupBy('month')
      .addGroupBy('year')
      .addOrderBy(`"users"."name"`, "ASC")
      .where(`extract(year from "userKudos"."historyCreatedAt") = :year`, {year})
      .andWhere(`to_char("userKudos"."historyCreatedAt", 'Mon') = :month`, {month: monthShorten})
      .getRawMany();
  }

  async getGivenAll(): Promise<{ quantity: number, year: number, month: string, name: string }[]> {
    return await this.userKudosRepository.createQueryBuilder("userKudos")
      .select('COUNT(*)', 'quantity')
      .leftJoin('userKudos.user', 'users')
      .addSelect(`extract(year from "userKudos"."historyCreatedAt")`, 'year')
      .addSelect(`to_char("userKudos"."historyCreatedAt", 'Mon')`, 'month')
      .addSelect([`"users"."name"`])
      .addGroupBy(`"users"."name"`)
      .addGroupBy('month')
      .addGroupBy('year')
      .addOrderBy(`"users"."name"`, "ASC")
      .getRawMany();
  }

  async saveKudos(description: string, from: User, users: User[], createDate = new Date()): Promise<UserKudosEntity[]> {
    const kudo = this.kudosRepository.create()
    kudo.description = description;

    await this.kudosRepository.save(kudo);

    const userKudos = users.map(user => {
      const userKudos = this.userKudosRepository.create();
      userKudos.user = user;
      userKudos.kudos = kudo;
      userKudos.from = from;
      userKudos.historyCreatedAt = createDate;
      return userKudos;
    })

    kudo.userKudos = userKudos;
    from.userKudos = userKudos;

    return await this.userKudosRepository.save(userKudos);
  }
}
