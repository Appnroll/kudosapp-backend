import {Observable} from "rxjs";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {SlackService} from "../kudos/services/slack.service";

@Injectable()
export class SlackTokenGuard implements CanActivate {

  constructor(private slackService: SlackService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const timeWhenResponseUrlIsAvailable = this.slackService.getSlackResponseDelay()
    const validToken = process.env.SLACK_TOKEN || 'hDa8MTD79bTgTpfAQ8W6cWc4'
    let body = request.body;

    if (body.payload) {
      body = JSON.parse(body.payload);
    }

    if (validToken !== body.token && !body.response_url) {
      this.slackService.responseInvalidToken(body.response_url, timeWhenResponseUrlIsAvailable)
      return false;
    } else {
      return true;
    }

  }
}