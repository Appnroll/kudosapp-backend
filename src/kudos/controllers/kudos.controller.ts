import {Controller, Get} from '@nestjs/common';
import {KudosService} from "../services/kudos.service";
import {Kudos} from "../model/kudos.entity";
import {KudosDto} from "../dto/kudos.dto";

@Controller('kudos')
export class KudosController {

    constructor(private kudosService: KudosService) {
    }

    @Get()
    async getKudos(): Promise<KudosDto[]> {
        const kudos = await this.kudosService.getAll();
        return kudos.map((r: Kudos) => new KudosDto(r.id, r.from, r.givenTo, r.description))
    }

}
