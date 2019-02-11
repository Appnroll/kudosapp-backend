import {Injectable} from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class DateService {

  getMonthShorten(monthNumber: number) {
    const yearWithSpecificMonth = moment(`${monthNumber}-01-2019`, 'MM-DD-YYYY')
    return yearWithSpecificMonth.format('MMM');
  }

}
