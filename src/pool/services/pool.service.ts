import {Injectable} from '@nestjs/common';

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
}
