import {Observable} from "rxjs";
import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {SlackService} from "../services/slack.service";

@Injectable()
export class SlackTokenGuard implements CanActivate {

    constructor(private slackService: SlackService) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001
        const validToken = process.env.SLACK_TOKEN || 'hDa8MTD79bTgTpfAQ8W6cWc4'
        const body = request.body;

        console.log(body);

        if (validToken !== body.token && !body.response_url) {
            this.slackService.responseInvalidToken(body.response_url, timeWhenResponseUrlIsAvailable)
            return false;
        } else {
            return true;
        }

    }
}