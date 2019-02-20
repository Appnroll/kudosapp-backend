import {Injectable} from '@nestjs/common';
import {FieldType, PollAction, PoolActionUser} from "../dto/poll-action.dto";
import {SlackService} from "../../kudos/services/slack.service";
import {SlackHelperService} from "../../services/slack-helper.service";

export interface PollData {
  question: string;
  options: string[]
}

@Injectable()
export class PollService {


  constructor(private readonly slackService: SlackService, private readonly slackHelperService: SlackHelperService) {

  }


  extractPollData(text: string): PollData {
    const [question, ...options] = text.split(';')
    return {
      question: question.trim(), options: options.map(el => el.trim())
    }
  }

  updateOptionValue(selectedValue: PollAction, values: FieldType[], user: PoolActionUser) {
    const index = Number(selectedValue.value);
    const currentValue = values[index];
    if (currentValue.value.indexOf(user.name) >= 0) {
      currentValue.value = currentValue.value.replace(user.name, '')
    } else {
      currentValue.value = `${currentValue.value} ${user.name}`.replace(/\s+/g, " ").trim()
    }
    if (currentValue.value !== "") {
      currentValue.title = `${currentValue.title} (\`${currentValue.value.split('').length} \`)`;
    } else {
      currentValue.title = currentValue.title.replace(/[(.*?)]/, '')
    }
    return values;
  }
}
