import {Body, Controller, Get, HttpCode, HttpException, HttpService, HttpStatus, Post} from '@nestjs/common';
import {KudosService} from "../services/kudos.service";
import {KudosDto} from "../dto/kudos.dto";
import {PostKudosDto} from "../dto/post-kudos.dto";
import {KudosRankingDto} from "../dto/kudos-ranking.dto";
import {KudosFromDto} from "../dto/kudos-from.dto";
import {KudosGivenDto} from "../dto/kudos-given.dto";
import {PostSlackDto} from "../dto/post-slack.dto";
import {UserService} from "../services/user.service";

@Controller('kudos')
export class KudosController {

    constructor(private kudosService: KudosService,
                private userService: UserService,
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

    @Post('slack')
    @HttpCode(201)
    async postSlack(@Body() body: PostSlackDto): Promise<{ text: string }> {

        console.log(body)

        const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001
        const validToken = process.env.SLACK_TOKEN || 'hDa8MTD79bTgTpfAQ8W6cWc4'

        if (validToken !== body.token) {
            console.log('invalid')
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
            const userExist = await this.userService.checkIfUserExist(givenToUser);
            if (!userExist) {
                this.kudosService.delayedSlackResponse(body.response_url, timeWhenResponseUrlIsAvailable, {
                    "text": "User does not exist, please check name!",
                    "response_type": "ephemeral"
                })
            } else {
                await this.kudosService.saveKudos({description: description, from: body.user_name, user: givenToUser})
                this.kudosService.delayedSlackResponse(body.response_url, timeWhenResponseUrlIsAvailable, {
                    "response_type": "ephemeral",
                    "text": "Kudos awarded successfully 👑"
                })
            }
        }

        console.log('body')
        console.log(body)
        console.log(body.trigger_id)
        const req: any = await this.httpService
            .post(`https://slack.com/api/dialog.open?token=${process.env.SLACK_OAUTH_TOKEN}`,
                {
                    "trigger_id": `${body.trigger_id}`,
                    "dialog": {
                        "callback_id": `kudos-${Math.random().toString(36).substring(7)}`,
                        "title": "Request a Ride",
                        "submit_label": "Request",
                        "notify_on_cancel": true,
                        "state": "Limo",
                        "elements": [
                            {
                                "type": "text",
                                "label": "Pickup Location",
                                "name": "loc_origin"
                            },
                            {
                                "type": "text",
                                "label": "Dropoff Location",
                                "name": "loc_destination"
                            }
                        ]
                    }
                }
                , {headers: {'content-type': 'application/json'}}).toPromise()

        console.log(req.body);
        console.log(req.data);

        return {text: '✅ Thanks for submitting Kudos!'}
    }
}
