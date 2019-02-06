import {HttpService, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "../model/user.entity";
import {InjectRepository} from '@nestjs/typeorm';
import {InjectConfig} from 'nestjs-config';
import {map} from "rxjs/operators";
import {stringify} from "querystring";

@Injectable()
export class SlackService {

  SLACK_API: string;

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectConfig() private readonly config,
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

  async fetchAvatars() {
    const req: any = await this.httpService.get(`${this.SLACK_API}/users.list?token=${this.config.get('slack').slackOAuthToken}`).toPromise()
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

    await this.httpService
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

  getSlackResponseDelay() {
    return new Date().getTime() + 3001;
  }

}
