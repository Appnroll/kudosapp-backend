import {Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post} from '@nestjs/common';
import {KudosService} from "../services/kudos.service";
import {Kudos} from "../model/kudos.entity";
import {KudosDto} from "../dto/kudos.dto";
import {PostKudosDto} from "../dto/post-kudos.dto";
import {KudosRankingDto} from "../dto/kudos-ranking.dto";
import {KudosFromDto} from "../dto/kudos-from.dto";
import {KudosGivenDto} from "../dto/kudos-given.dto";
import {PostSlackDto} from "../dto/post-slack.dto";

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

    @Post('slack')
    @HttpCode(201)
    async postSlack(@Body() body: PostSlackDto): Promise<{ text: string }> {
        const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001
        const validToken = process.env.SLACK_TOKEN || 'uguIvg4jtfZ0wQ5r2MOTXBiC'

        if (validToken !== body.token) {
            this.kudosService.delayedSlackResponse(body.response_url, timeWhenResponseUrlIsAvailable, {
                "text": "Ooups, something went wrong!",
                "response_type": "ephemeral",
                "attachments": [
                    {
                        "text": "Ask your Slack Admin for more details - Auth issue!"
                    }
                ]
            })
            return;
        } else {
            const values = body.text.split(';')
            const givenToUser = values[0]
            const description = values[1]

            await this.kudosService.saveKudos({description: description, from: body.user_name, user: givenToUser})

            console.log(body)

            this.kudosService.delayedSlackResponse(body.response_url, timeWhenResponseUrlIsAvailable, {
                "response_type": "ephemeral",
                "text": "Kudos awarded successfully 👑"
            })
        }

        return {text: '✅ Thanks for submitting Kudos!'}
    }

    @Get('slackAvatars')
    async getAvatars() {
        await this.kudosService.getAvatars();
    }

}
