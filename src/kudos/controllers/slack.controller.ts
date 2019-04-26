import {Controller, Get, HttpCode, Query, Req, Res, UseGuards} from '@nestjs/common';
import {SlackService} from "../services/slack.service";
import {ApiUseTags} from '@nestjs/swagger';
import {UserTokenService} from "../services/user-token.service";
import {AuthGuard} from "../../guards/auth.guard";
import {SlackAuthService} from "../../services/slack-auth.service";

@Controller('slack')
@ApiUseTags('slack')
export class SlackController {

  constructor(private slackService: SlackService,
              private userSlackService: UserTokenService,
              private slackAuthService: SlackAuthService) {
  }

  @Get('redirect')
  @HttpCode(200)
  async getTokenAndRedirect(@Query() query, @Res() res) {
    const {access_token, user} = await this.slackAuthService.getToken(query.code);
    await this.userSlackService.saveOrUpdate(access_token, user.id)
    const redirectUri = this.slackAuthService.redirectAfterLogin(access_token, user);
    return res.redirect(redirectUri.toString())
  }

  @Get('avatars')
  @HttpCode(200)
  async fetchAvatars() {
    try {
      await this.slackService.fetchUsersWithAvatars();
    } catch (err){
      return {error: err.toString()}
    }
    return {status: 'ok'};
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async logout(@Req() req) {
    const userToken = req.userToken;
    await this.userSlackService.removeToken(userToken);
    await this.slackAuthService.revokeToken(userToken.token);
    return {status: 'ok'};
  }

}
