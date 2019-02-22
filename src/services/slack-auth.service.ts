import {HttpService, Inject, Injectable} from '@nestjs/common';
import {stringify} from "querystring";
import {map} from "rxjs/operators";

export interface SlackAuthCredentials {
  slackOAuthToken: string
  slackClientSecret: string
  slackClientId: string
  slackApi: string
  slackRedirectUri: string
  slackAfterLoginRedirect: string
}

@Injectable()
export class SlackAuthService {

  constructor(private readonly httpService: HttpService,
              @Inject('SlackOAuthConfigService') private readonly slackAuthCredentials: SlackAuthCredentials) {
  }

  async getToken(code: string) {
    const slackClientSecret = this.slackAuthCredentials.slackClientSecret;
    const clientId = this.slackAuthCredentials.slackClientId;
    const redirectUri = this.slackAuthCredentials.slackRedirectUri;
    const headersRequest = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const paramsQueryString = stringify({
      client_secret: slackClientSecret,
      client_id: clientId,
      code,
      redirect_uri: redirectUri
    })
    return await this.httpService.post(
      `${this.slackAuthCredentials.slackApi}/oauth.access?${paramsQueryString}`,
      null, {headers: headersRequest})
      .pipe(map(res => res.data))
      .toPromise();
  }

  redirectAfterLogin(token: string, user: { name: string, id: string }) {
    const params = stringify({
      token,
      name: user.name, id: user.id
    })
    return new URL(`${this.slackAuthCredentials.slackAfterLoginRedirect}?${params}`)
  }

  async revokeToken(token: string) {
    const headersRequest = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const paramsQueryString = stringify({
      token,
    })
    await this.httpService
      .get(`${this.slackAuthCredentials.slackApi}/auth.revoke?${paramsQueryString}`, {headers: headersRequest})
      .toPromise()
  }

}
