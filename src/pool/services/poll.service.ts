import { Injectable } from '@nestjs/common';
import * as moment from "../../kudos/services/date.service";

@Injectable()
export class PollService {

  extractPoolData(text: string):  {
    const yearWithSpecificMonth = moment(`${monthNumber}-01-2019`, 'MM-DD-YYYY')
    return yearWithSpecificMonth.format('MMM');
  }
}
