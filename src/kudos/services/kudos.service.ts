import {Injectable} from '@nestjs/common';
import {Kudos} from "../model/kudos.entity";
import {Repository} from "typeorm";
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class KudosService {

    constructor(@InjectRepository(Kudos) private readonly kudosRepository: Repository<Kudos>) {
    }

    async getAll(): Promise<Kudos[]> {
        return await this.kudosRepository.find();
    }

}
