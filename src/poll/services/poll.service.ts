import {Injectable} from '@nestjs/common';
import {FieldType, PollAction, PoolActionUser} from "../dto/poll-action.dto";

export interface PollData {
  question: string;
  options: string[]
}

@Injectable()
export class PollService {

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
    return values;
  }
}
