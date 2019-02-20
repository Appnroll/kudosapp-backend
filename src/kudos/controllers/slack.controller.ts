import {Controller, Get, HttpCode, Query, Req, Res, UseGuards} from '@nestjs/common';
import {SlackService} from "../services/slack.service";
import {ApiUseTags} from '@nestjs/swagger';
import {UserTokenService} from "../services/user-token.service";
import {AuthGuard} from "../../guards/auth.guard";

@Controller('slack')
@ApiUseTags('slack')
export class SlackController {

  constructor(private slackService: SlackService, private userSlackService: UserTokenService) {
  }

  @Get('redirect')
  @HttpCode(200)
  async redirect(@Query() query, @Res() res) {
    const {access_token, user} = await this.slackService.getToken(query.code);
    await this.userSlackService.saveOrUpdate(access_token, user.id)
    const redirectUri = this.slackService.redirectAfterLogin(access_token, user);
    return res.redirect(redirectUri.toString())
  }

  @Get('avatars')
  @HttpCode(200)
  async fetchAvatars() {
    await this.slackService.fetchUsersWithAvatars();
    return {status: 'ok'};
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async logout(@Req() req) {
    const userToken = req.userToken;
    await this.userSlackService.removeToken(userToken);
    await this.slackService.revokeToken(userToken.token);
    return {status: 'ok'};
  }

}
