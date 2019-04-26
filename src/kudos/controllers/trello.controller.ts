import { Controller, Get } from '@nestjs/common';
import { TrelloService } from "../services/trello.service";

@Controller('trello')
export class TrelloController {

  constructor(private trelloService: TrelloService) {
  }

  @Get('/cards')
  async getBoards() {
    await this.trelloService.fetchCards();
  }

  @Get('/users')
  async getUsers() {
    try {
      await this.trelloService.saveTrelloUsers();
    } catch (e) {
      return {error: e.toString()}
    }
  }

}
