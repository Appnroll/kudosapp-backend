import {HttpService, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "../model/user.entity";
import {InjectRepository} from '@nestjs/typeorm';
import {InjectConfig} from 'nestjs-config';
import {map} from "rxjs/operators";
import {stringify} from "querystring";
import {get} from 'lodash'
import {SlackHelperService} from "../../services/slack-helper.service";

@Injectable()
export class SlackService {

  SLACK_API: string;

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectConfig() private readonly config,
              private readonly slackHelperService: SlackHelperService,
              private readonly httpService: HttpService) {
    this.SLACK_API = this.config.get('kudos').slackApi
  }


  async fetchUsersWithAvatars() {
    const req: any = await this.httpService.get(`${this.SLACK_API}/users.list?token=${this.config.get('kudos').slackOAuthToken}`).toPromise()
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



  async openKudoSlackDialog(triggerId) {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`
    };
    console.log(`Opening slack dialog window, trigger_id: ${triggerId}`)

    const requestData = {
      "trigger_id": `${triggerId}`,
      "dialog": {
        "callback_id": `kudos-open-dialog`,
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
    }

    await this.httpService
      .post(`${this.SLACK_API}/dialog.open`, requestData, {headers: headersRequest}).toPromise()
  }
}
