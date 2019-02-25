import {Controller, Delete, Get, HttpCode, Put, Query, Req, Res, UseGuards} from '@nestjs/common';
import {ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {AuthGuard, AuthorizedRequest} from '../../guards/auth.guard';
import {UserDto} from '../../kudos/dto/user.dto';
import {SlackService} from '../../kudos/services/slack.service';
import {UserService} from '../../kudos/services/user.service';
import {SlackAuthService} from "../../services/slack-auth.service";
import {UserTokenService} from "../../kudos/services/user-token.service";

@Controller('availability')
@ApiUseTags('availability')
export class AvailabilityController {
  constructor(private userService: UserService,
              private slackService: SlackService,
              private slackAuthService: SlackAuthService,
              private userTokenService: UserTokenService) {
  }

  @Get('redirect')
  @HttpCode(200)
  async getTokenAndRedirect(@Query() query, @Res() res) {
    const {access_token, user} = await this.slackAuthService.getToken(query.code);
    await this.userTokenService.saveOrUpdate(access_token, user.id)
    const redirectUri = this.slackAuthService.redirectAfterLogin(access_token, user);
    return res.redirect(redirectUri.toString())
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiResponse({status: 200, description: 'Get all people availability', type: UserDto, isArray: true})
  async getPeople(): Promise<UserDto[]> {
    // TODO refactor to query builder ?
    return Promise.all((await this.userService.findAll()).map(async (u) => {
      const available = await this.userService.determineAvailability(u);
      return {
        name: u.name,
        avatar: this.userService.mapAvatar(u),
        available,
      };
    }));
  }

  @Put()
  @UseGuards(AuthGuard)
  @ApiResponse({status: 201, description: 'Mark myself as available'})
  async markAsAvailable(@Req() req: AuthorizedRequest): Promise<{ success: boolean }> {
    const userToken = req.userToken;
    await this.userService.available(userToken.user);
    return {
      success: true,
    };
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiResponse({status: 200, description: 'Mark myself as out of the office'})
  async markAsUnavailable(@Req() req: AuthorizedRequest): Promise<{ success: boolean }> {
    const userToken = req.userToken;
    await this.userService.unavailable(userToken.user);
    return {
      success: true,
    };
  }
}
