import {HttpService, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "../model/user.entity";
import {InjectRepository} from '@nestjs/typeorm';
import {InjectConfig} from 'nestjs-config';
import {map} from "rxjs/operators";
import {stringify} from "querystring";
import {get} from 'lodash'
import {PollData} from "../../poll/services/poll.service";
import {PollActionDto} from "../../poll/dto/poll-action.dto";
import {SlackHelperService} from "../../services/slack-helper.service";

@Injectable()
export class SlackService {

  SLACK_API: string;

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectConfig() private readonly config,
              private readonly slackHelperService: SlackHelperService,
              private readonly httpService: HttpService) {
    this.SLACK_API = this.config.get('slack').slackApi
  }


  redirectAfterLogin(token: string, user: { name: string, id: string }) {
    const params = stringify({
      token,
      name: user.name, id: user.id
    })
    return new URL(`${this.config.get('slack').slackAfterLoginRedirect}?${params}`)
  }

  async getToken(code: string) {
    const slackClientSecret = this.config.get('slack').slackClientSecret;
    const clientId = this.config.get('slack').slackClientId;
    const redirectUri = this.config.get('slack').slackRedirectUri;
    const headersRequest = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const paramsQueryString = stringify({
      client_secret: slackClientSecret,
      client_id: clientId,
      code,
      redirect_uri: redirectUri
    })
    return await this.httpService.post(`${this.SLACK_API}/oauth.access?${paramsQueryString}`, null, {headers: headersRequest})
      .pipe(
        map(res => {
          return res.data
        })
      )
      .toPromise();
  }

  async fetchUsersWithAvatars() {
    const req: any = await this.httpService.get(`${this.SLACK_API}/users.list?token=${this.config.get('slack').slackOAuthToken}`).toPromise()
    const users = get(req, 'data.members', []).map(el => ({
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

  async revokeToken(token: string) {
    const headersRequest = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const paramsQueryString = stringify({
      token,
    })
    await this.httpService.get(`${this.SLACK_API}/auth.revoke?${paramsQueryString}`, {headers: headersRequest}).toPromise()
  }


  async openSlackDialog(triggerId) {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`
    };
    console.log(`Opening slack dialog window, trigger_id: ${triggerId}`)
    const request = await this.httpService
      .post(`${this.SLACK_API}/dialog.open`,
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


  async sendSlackChatMessage(data: PollData, channelId: string) {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`
    };

    const requestData = {
      "channel": `${channelId}`,
      "attachments": [
        {
          "fields": data.options.map((el, i) => ({
            title: `${this.slackHelperService.getSlackNumberEmoji(i)} - ${el}`,
            value: "",
            short: false
          })),
          "text": `${data.question}`,
          "callback_id": `button_tutorial-${Math.random().toString(36).substring(7)}`,
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions":
            data.options.map((el, i) => ({
              name: "pool",
              text: `${this.slackHelperService.getSlackNumberEmoji(i)}`,
              style: "danger",
              type: "button",
              value: `${i}`
            }))
        }
      ],
    }

    console.log('req')
    console.log(requestData.attachments[0].fields)
    console.log(requestData.attachments[0].actions)

    await this.httpService.post(`${this.SLACK_API}/chat.postMessage`, requestData, {headers: headersRequest}).toPromise()
  }

  async updateSlackMessage(data: PollActionDto, updatedFieldValue) {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`
    };

    await this.httpService
      .post(`${this.SLACK_API}/chat.update`,
        {
          "channel": `${data.channel.id}`,
          "ts": `${data.message_ts}`,
          "attachments": [
            {
              "fields": updatedFieldValue,
              "text": data.original_message.attachments[0].text,
              "callback_id": `${data.callback_id}`,
              "color": "#3AA3E3",
              "attachment_type": "default",
              "actions": data.original_message.attachments[0].actions
            }
          ],
        }, {headers: headersRequest}).toPromise()
  }

}
