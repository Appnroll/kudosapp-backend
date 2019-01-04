import {Injectable} from '@nestjs/common';
import {Kudos} from "../model/kudos.entity";
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';
import {PostKudosDto} from "../dto/postKudos.dto";

@Injectable()
export class KudosService {

    constructor(@InjectRepository(Kudos) private readonly kudosRepository: Repository<Kudos>) {
    }

    async getAll(): Promise<Kudos[]> {
        return await this.kudosRepository.find();
    }

    async getRankings(): Promise<Kudos[]> {
        return await this.kudosRepository.createQueryBuilder("kudos")
            .select("\'givenTo\'")
            .select('COUNT(*)', 'totalPoints')
            .addGroupBy("\'kudos.givenTo\'")
            .getRawMany();
    }

    async saveKudos(kudosData: PostKudosDto): Promise<Kudos> {
        const kudo = this.kudosRepository.create(kudosData)
        kudo.givenTo = kudosData.user
        return await this.kudosRepository.save(kudo);
    }

}
