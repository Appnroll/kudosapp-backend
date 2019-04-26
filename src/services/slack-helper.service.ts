import {HttpService, Injectable} from '@nestjs/common';

export const enum SLACK_ACTION_TYPES {
  KUDOS_OPEN_DIALOG = 'kudos-open-dialog',
  POLL_ANSWER = 'poll-answer',
  POLL_CREATE_POLL = 'poll-create-poll',
  POLL_OPEN_DIALOG = 'poll-open-dialog',
}

export const NUMBER_EMOJI_MAP = {
  1: ":one:",
  2: ":two:",
  3: ":three:",
  4: ":four:",
  5: ":five:",
  6: ":six:",
  7: ":seven:",
  8: ":eight:",
  9: ":nine:",
  0: ":zero:"
}


@Injectable()
export class SlackHelperService {

  constructor(private readonly httpService: HttpService) {

  }

  getSlackNumberEmoji(value: number) {
    const stringedNumber = value.toString().split('')
    return stringedNumber.reduce((acc, val) => {
      return acc + NUMBER_EMOJI_MAP[val]
    }, "")
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
