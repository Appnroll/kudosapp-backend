import {Controller, Get, HttpCode} from '@nestjs/common';
import {SlackService} from "../services/slack.service";

@Controller('slack')
export class SlackController {


    constructor(private slackService: SlackService) {
    }

    @Get('avatars')
    @HttpCode(200)
    async fetchAvatars() {
        await this.slackService.fetchAvatars();
        return {status: 'ok'};
    }

}
