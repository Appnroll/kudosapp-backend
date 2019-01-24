import {Controller, Get} from '@nestjs/common';
import {TrelloService} from "../services/trello.service";

@Controller('trello')
export class TrelloController {

    constructor(private trelloService: TrelloService){}

    @Get('/cards')
    async getBoards() {
        await this.trelloService.fetchCards();
    }

    @Get('/users')
    async getUsers() {
        await this.trelloService.saveTrelloUsers();
    }

}
