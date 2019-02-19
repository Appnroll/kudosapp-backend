import {Injectable} from '@nestjs/common';
import {FieldType, PoolAction, PoolActionUser} from "../dto/pool-action.dto";

export interface PoolData {
  question: string;
  options: string[]
}

@Injectable()
export class PoolService {

  extractPoolData(text: string): PoolData {
    const [question, ...options] = text.split(';')
    return {
      question: question.trim(), options: options.map(el => el.trim())
    }
  }

  updateOptionValue(selectedValue: PoolAction, values: FieldType[], user: PoolActionUser) {
    const index = Number(selectedValue.value);
    const currentValue = values[index];
    if (currentValue.value.indexOf(user.name) >= 0) {
      currentValue.value = currentValue.value.replace(user.name, '')
    } else {
      currentValue.value = `${currentValue.value} ${user.name}`.trim()
    }
    return values;
  }
}
