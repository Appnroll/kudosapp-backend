import {Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post} from '@nestjs/common';
import {KudosService} from "../services/kudos.service";
import {Kudos} from "../model/kudos.entity";
import {KudosDto} from "../dto/kudos.dto";
import {PostKudosDto} from "../dto/postKudos.dto";
import {KudosRankingDto} from "../dto/kudos-ranking.dto";

@Controller('kudos')
export class KudosController {

    constructor(private kudosService: KudosService) {
    }

    @Get()
    async getKudos(): Promise<KudosDto[]> {
        const kudos = await this.kudosService.getAll();
        return kudos.map((r: Kudos) => ({id: r.id, from: r.from, givenTo: r.givenTo, description: r.description}))
    }

    @Get('rankings')
    async getRankings(): Promise<KudosRankingDto[]> {
        const kudos = await this.kudosService.getRankings();
        console.log(kudos)
        return [];
    }

    @Post()
    @HttpCode(201)
    async postKudos(@Body() body: PostKudosDto): Promise<KudosDto> {
        if (!body.description || !body.from || !body.user) {
            throw new HttpException('Wrong input', HttpStatus.BAD_REQUEST)
        }
        const kudo = await this.kudosService.saveKudos(body)
        return {id: kudo.id, from: kudo.from, givenTo: kudo.givenTo, description: kudo.description}
    }

}
