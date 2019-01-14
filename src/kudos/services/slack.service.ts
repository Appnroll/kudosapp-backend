import {HttpService, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "../model/user.entity";
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class SlackService {


    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
                private readonly httpService: HttpService) {
    }

    async fetchAvatars() {
        const req: any = await this.httpService.get(`https://slack.com/api/users.list?token=${process.env.SLACK_OAUTH_TOKEN}`).toPromise()
        const users = req.data.members.map(el => ({
            name: el.name,
            slackId: el.id,
            image_24: el.profile.image_24,
            image_32: el.profile.image_32,
            image_48: el.profile.image_48,
            image_72: el.profile.image_72,
            image_192: el.profile.image_192
        }))
        const usersEntities = this.userRepository.create(users)
        await this.userRepository.save(usersEntities)
    }


    async openSlackDialog(triggerId) {
        const headersRequest = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`
        };

        await this.httpService
            .post(`https://slack.com/api/dialog.open`,
                {
                    "trigger_id": `${triggerId}`,
                    "dialog": {
                        "callback_id": `kudos-${Math.random().toString(36).substring(7)}`,
                        "title": "Give kudo!",
                        "submit_label": "OK",
                        "notify_on_cancel": false,
                        "elements": [
                            {
                                "label": "Give kudos to:",
                                "name": "kudos_given",
                                "type": "select",
                                "data_source": "users"
                            },
                            {
                                "label": "Description",
                                "name": "description",
                                "type": "textarea",
                                "hint": "Give short kudo description!"
                            }
                        ]
                    }
                }, {headers: headersRequest}).toPromise()
    }


    responseInvalidToken(responseUrl, timeWhenResponseUrlIsAvailable) {
        this.delayedSlackResponse(responseUrl, timeWhenResponseUrlIsAvailable, {
            "text": "Ooups, something went wrong!",
            "response_type": "ephemeral",
            "attachments": [
                {
                    "text": "Ask your Slack Admin for more details - Auth issue!"
                }
            ]
        })
    }

    responseOk(responseUrl, timeWhenResponseUrlIsAvailable) {
        this.delayedSlackResponse(responseUrl, timeWhenResponseUrlIsAvailable, {
            "text": "Kudos awarded successfully 👑",
            "response_type": "ephemeral"

        })
    }

    responseInvalidUsername(responseUrl, timeWhenResponseUrlIsAvailable) {
        this.delayedSlackResponse(responseUrl, timeWhenResponseUrlIsAvailable, {
            "response_type": "ephemeral",
            "text": "User does not exist, please check name|names!"
        })
    }


    delayedSlackResponse(url: string, timeWhenResponseUrlIsAvailable: number, reason: {}) {
        setTimeout(
            () => (
                this.httpService.post(url, reason, {headers: {'content-type': 'application/json'}})
                    .toPromise()
                    .then()
                    .catch(console.log)
            ),
            Math.max(timeWhenResponseUrlIsAvailable - new Date().getTime(), 0)
        )
    }


}
