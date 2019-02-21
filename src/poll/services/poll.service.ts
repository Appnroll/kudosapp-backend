import {HttpService, Injectable} from '@nestjs/common';
import {
  CreatePollActionDto,
  FieldType,
  PollAction,
  PoolActionUser,
  UpdateMessageActionDto
} from "../dto/poll-action.dto";
import {SLACK_ACTION_TYPES, SlackHelperService} from "../../services/slack-helper.service";
import {InjectConfig} from 'nestjs-config';

export interface PollData {
  question: string;
  options: string[]
}

@Injectable()
export class PollService {

  SLACK_API: string;

  constructor(@InjectConfig() private readonly config,
              private readonly slackHelperService: SlackHelperService,
              private readonly httpService: HttpService) {
    this.SLACK_API = this.config.get('slack').slackApi
  }

  extractPollData(text: string): PollData {
    const [question, ...options] = text.split(';')
    return {
      question: question.trim(), options: options.map(el => el.trim())
    }
  }

  extractPollDataFromDialog({submission}: CreatePollActionDto): PollData {
    const {question, ...rest} = submission
    return {
      question: question.trim(), options: Object.values(rest)
    }
  }

  async sendSlackChatMessage(data: PollData, channelId: string) {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.POOL_SLACK_AUTH_TOKEN}`
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
          "callback_id": `${SLACK_ACTION_TYPES.POLL_ANSWER}`,
          "color": "#ff8566",
          "attachment_type": "default",
          "actions":
            data.options.map((el, i) => ({
              name: "pool",
              text: `${this.slackHelperService.getSlackNumberEmoji(i)}`,
              type: "button",
              value: `${i}`
            }))
        }
      ],
    }

    await this.httpService.post(`${this.SLACK_API}/chat.postMessage`, requestData, {headers: headersRequest}).toPromise()
  }

  async updateSlackMessage(data: UpdateMessageActionDto, updatedFieldValue) {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.POOL_SLACK_AUTH_TOKEN}`
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
              "callback_id": `${SLACK_ACTION_TYPES.POLL_ANSWER}`,
              "color": "#ff8566",
              "attachment_type": "default",
              "actions": data.original_message.attachments[0].actions
            }
          ],
        }, {headers: headersRequest}).toPromise()
  }

  async openPollDialog(triggerId) {
    const headersRequest = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.POOL_SLACK_AUTH_TOKEN}`
    };
    console.log(`Opening slack dialog window, trigger_id: ${triggerId}`)

    const requestData = {
      "trigger_id": `${triggerId}`,
      "dialog": {
        "callback_id": `${SLACK_ACTION_TYPES.POLL_CREATE_POLL}`,
        "title": "Create poll",
        "submit_label": "OK",
        "notify_on_cancel": false,
        "elements": [
          {
            "type": "text",
            "label": "Question",
            "name": "question"
          },
          {
            "type": "text",
            "label": "Answer 1",
            "name": "option1",
          },
          {
            "type": "text",
            "label": "Answer 2",
            "name": "option2",
          },
          {
            "type": "text",
            "label": "Answer 3",
            "name": "option3",
            "optional": "true"
          },
          {
            "type": "text",
            "label": "Answer 4",
            "name": "option4",
            "optional": "true"
          },
          {
            "type": "text",
            "label": "Answer 5",
            "name": "option5",
            "optional": "true"
          }
        ]
      }
    }

    await this.httpService
      .post(`${this.SLACK_API}/dialog.open`, requestData, {headers: headersRequest}).toPromise()
  }

  updateOptionValue(selectedValue: PollAction, values: FieldType[], user: PoolActionUser) {
    const index = Number(selectedValue.value);
    const currentValue = values[index];

    if (currentValue.value.indexOf(user.name) >= 0) {
      currentValue.value = this.removeWord(currentValue.value, user.name).trimRight()
    } else {
      currentValue.value = this.clearAdditionalSpaces(`${currentValue.value} ${user.name}`)
    }

    currentValue.title = this.clearTitle(currentValue.title)

    if (currentValue.value !== "") {
      currentValue.title = `${currentValue.title} (\`${currentValue.value.split(' ').length}\`)`;
    }

    currentValue.title = this.clearAdditionalSpaces(currentValue.title)
    return values;
  }

  clearAdditionalSpaces(str: string) {
    return str.replace(/\s+/g, " ").trim()
  }

  removeWord(str: string, word: string) {
    return str.replace(word, '')
  }

  clearTitle(str: string) {
    return str.replace(/\(.*\)/, "");
  }

}
