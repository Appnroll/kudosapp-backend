import {Injectable} from '@nestjs/common';
import {FieldType, PollAction, PoolActionUser} from "../dto/poll-action.dto";

export interface PollData {
  question: string;
  options: string[]
}

@Injectable()
export class PollService {
  constructor() {

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

  clearTitle(str: string){
    return str.replace(/\(.*\)/, "");
  }

}
