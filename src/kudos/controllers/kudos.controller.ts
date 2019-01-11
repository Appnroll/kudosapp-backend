import {Body, Controller, Get, HttpCode, HttpException, HttpService, HttpStatus, Post} from '@nestjs/common';
import {KudosService} from "../services/kudos.service";
import {KudosDto} from "../dto/kudos.dto";
import {PostKudosDto} from "../dto/post-kudos.dto";
import {KudosRankingDto} from "../dto/kudos-ranking.dto";
import {KudosFromDto} from "../dto/kudos-from.dto";
import {KudosGivenDto} from "../dto/kudos-given.dto";
import {PostSlackDto} from "../dto/post-slack.dto";
import {UserService} from "../services/user.service";
import {DialogPostSlackDto} from "../dto/dialog-post-slack.dto";
import {SlackService} from "../services/slack.service";
import {SingleKudosSlackDto} from "../dto/single-kudos-slack.dto";

@Controller('kudos')
export class KudosController {

    constructor(private kudosService: KudosService,
                private userService: UserService,
                private slackService: SlackService,
                private httpService: HttpService) {
    }

    @Get()
    async getKudos(): Promise<KudosDto[]> {
        return await this.kudosService.getAllWithAvatars();
    }


    @Get('rankings')
    async getRankings(): Promise<KudosRankingDto[]> {
        const kudos = await this.kudosService.getRankings();
        return kudos.map(el => ({name: el.givenTo, totalPoints: el.totalPoints}));
    }

    @Get('from')
    async kudosFromUsers(): Promise<KudosFromDto[]> {
        const kudos = await this.kudosService.getFrom();
        return kudos.map(el => ({quantity: Number(el.quantity), year: el.year, from: el.from, month: el.month}));
    }

    @Get('given')
    async kudosGivenToUsers(): Promise<KudosGivenDto[]> {
        const kudos = await this.kudosService.getGiven();
        return kudos.map(el => ({quantity: Number(el.quantity), year: el.year, givenTo: el.givenTo, month: el.month}));
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

    @Post('multikudos')
    @HttpCode(201)
    async postSlack(@Body() body: PostSlackDto & DialogPostSlackDto): Promise<{ text: string }> {
        const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001
        const validToken = process.env.SLACK_TOKEN || 'hDa8MTD79bTgTpfAQ8W6cWc4'

        if (validToken !== body.token) {
            this.slackService.responseInvalidToken(body.response_url, timeWhenResponseUrlIsAvailable)
        } else {
            const values = body.text.split(';')
            const givenToUser = values[0]
            const [description, ...users] = values.reverse();
            const userExist = await this.userService.checkIfUserExist(givenToUser);
            if (!userExist) {
                this.slackService.responseInvalidUsername(body.response_url, timeWhenResponseUrlIsAvailable)
            } else {
                await this.kudosService.saveKudos({description: description, from: body.user_name, user: givenToUser})
                this.slackService.responseOk(body.response_url, timeWhenResponseUrlIsAvailable);
            }
        }

        console.log('body')
        console.log(body)
        console.log(body.trigger_id)

        return {text: '✅ Thanks for submitting Kudos!'}
    }

    @Post('singleKudos')
    @HttpCode(201)
    async singleKudo(@Body() body: SingleKudosSlackDto): Promise<void> {
        const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001
        const validToken = process.env.SLACK_TOKEN || 'hDa8MTD79bTgTpfAQ8W6cWc4'
        if (validToken !== body.token) {
            this.slackService.responseInvalidToken(body.response_url, timeWhenResponseUrlIsAvailable)
        } else {
            await this.slackService.openSlackDialog(body.trigger_id)
        }
    }

    @Post('slack')
    @HttpCode(201)
    async saveSingleKudo(@Body() body: DialogPostSlackDto): Promise<void> {

        console.log('in slack save single kudo')
        console.log(body)

        const payloadBody = JSON.parse(body.payload);

        console.log(payloadBody)

        const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001
        const validToken = process.env.SLACK_TOKEN || 'hDa8MTD79bTgTpfAQ8W6cWc4'
        if (validToken !== payloadBody.token) {
            console.log('invalid token')
            this.slackService.responseInvalidToken(payloadBody.response_url, timeWhenResponseUrlIsAvailable)
        } else {
            if (!payloadBody.submission.kudos_given) {
                this.slackService.responseInvalidUsername(payloadBody.response_url, timeWhenResponseUrlIsAvailable)
                return;
            }
            const user = await this.userService.findUserBySlackId(payloadBody.submission.kudos_given)
            if (!user) {
                this.slackService.responseInvalidUsername(payloadBody.response_url, timeWhenResponseUrlIsAvailable)
                return;
            }

            console.log('saving kudo')

            await this.kudosService.saveKudos({
                description: payloadBody.submission.description,
                from: payloadBody.user.name,
                user: user.name
            })
            this.slackService.responseOk(payloadBody.response_url, timeWhenResponseUrlIsAvailable);
        }
    }
}
