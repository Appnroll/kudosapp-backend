import {Body, Controller, Get, HttpCode, Post, UseGuards} from '@nestjs/common';
import {KudosService} from "../services/kudos.service";
import {KudosRankingDto} from "../dto/kudos-ranking.dto";
import {KudosFromDto} from "../dto/kudos-from.dto";
import {KudosGivenDto} from "../dto/kudos-given.dto";
import {PostSlackDto} from "../dto/post-slack.dto";
import {UserService} from "../services/user.service";
import {DialogPostSlackDto} from "../dto/dialog-post-slack.dto";
import {SlackService} from "../services/slack.service";
import {SingleKudosSlackDto} from "../dto/single-kudos-slack.dto";
import {SlackTokenGuard} from "../guards/slackToken.guard";
import {KudosDto} from "../dto/kudos.dto";

@Controller('kudos')
export class KudosController {

    constructor(private kudosService: KudosService,
                private userService: UserService,
                private slackService: SlackService) {
    }

    @Get()
    async getKudos(): Promise<KudosDto[]> {
        return await this.kudosService.getAllWithAvatars();
    }


    @Get('rankings')
    async getRankings(): Promise<KudosRankingDto[]> {
        const kudos = await this.kudosService.getRankings();
        return kudos.map(({name, totalPoints}) => ({name, totalPoints: Number(totalPoints)}));
    }

    @Get('from')
    async kudosFromUsers(): Promise<KudosFromDto[]> {
        const kudos = await this.kudosService.getFrom();
        return kudos.map(({quantity, name, month, year}) => ({quantity: Number(quantity), year, from: name, month}));
    }

    @Get('given')
    async kudosGivenToUsers(): Promise<KudosGivenDto[]> {
        const kudos = await this.kudosService.getGiven();
        return kudos.map(({quantity, name, month, year}) => ({quantity: Number(quantity), year, givenTo: name, month}));
    }

    @Post('multiKudos')
    @HttpCode(201)
    @UseGuards(SlackTokenGuard)
    async postSlack(@Body() body: PostSlackDto): Promise<{ text: string }> {
        const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001
        const [usersString, description] = body.text.split(';')
        const givenToUsersNames = usersString.replace(/\s+/g, " ").trim().split(' ');

        const fromUser = await this.userService.findByName(body.user_name);
        const givenToUsers = await this.userService.findByUsersName(givenToUsersNames);

        if (!givenToUsers || givenToUsers.length === 0 || !fromUser) {
            this.slackService.responseInvalidUsername(body.response_url, timeWhenResponseUrlIsAvailable)
        } else {
            await this.kudosService.saveKudos(description, fromUser, givenToUsers)
            this.slackService.responseOk(body.response_url, timeWhenResponseUrlIsAvailable);
        }


        return {text: '✅ Thanks for submitting Kudos!'}
    }

    @Post('singleKudos')
    @HttpCode(201)
    @UseGuards(SlackTokenGuard)
    async singleKudo(@Body() body: SingleKudosSlackDto): Promise<void> {
        await this.slackService.openSlackDialog(body.trigger_id)
    }

    @Post('slack')
    @HttpCode(201)
    @UseGuards(SlackTokenGuard)
    async saveSingleKudo(@Body() body: DialogPostSlackDto): Promise<void> {
        const payloadBody = JSON.parse(body.payload);
        const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001

        if (!payloadBody.submission.kudos_given) {
            this.slackService.responseInvalidUsername(payloadBody.response_url, timeWhenResponseUrlIsAvailable)
            return;
        }
        const givenToUser = await this.userService.findUserBySlackId(payloadBody.submission.kudos_given)
        const fromUser = await this.userService.findByName(payloadBody.user.name);

        if (!givenToUser || !fromUser) {
            this.slackService.responseInvalidUsername(payloadBody.response_url, timeWhenResponseUrlIsAvailable)
            return;
        }

        await this.kudosService.saveKudos(
            payloadBody.submission.description,
            fromUser,
            [givenToUser]
        )
        this.slackService.responseOk(payloadBody.response_url, timeWhenResponseUrlIsAvailable);
    }

}
