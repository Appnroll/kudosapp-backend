import {Body, Controller, Get, HttpCode, Post, UseGuards} from '@nestjs/common';
import {KudosService} from "../services/kudos.service";
import {KudosRankingDto} from "../dto/kudos-ranking.dto";
import {KudosFromDto} from "../dto/kudos-from.dto";
import {KudosGivenDto} from "../dto/kudos-given.dto";
import {PostSlackDto} from "../dto/post-slack.dto";
import {UserService} from "../services/user.service";
import {DialogPostSlackDto, PayloadClass} from "../dto/dialog-post-slack.dto";
import {SlackService} from "../services/slack.service";
import {SingleKudosSlackDto} from "../dto/single-kudos-slack.dto";
import {SlackTokenGuard} from "../guards/slackToken.guard";
import {KudosDto} from "../dto/kudos.dto";
import {ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {AuthGuard} from "../guards/auth.guard";

@Controller('kudos')
@ApiUseTags('kudos')
export class KudosController {

  constructor(private kudosService: KudosService,
              private userService: UserService,
              private slackService: SlackService) {
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiResponse({status: 200, description: 'Get all Kudos', type: KudosDto, isArray: true})
  getKudos(): Promise<KudosDto[]> {
    return this.kudosService.getAllWithAvatars();
  }

  @Get('rankings')
  @UseGuards(AuthGuard)
  @ApiResponse({status: 200, description: 'Get overall rankings', type: KudosRankingDto, isArray: true})
  async getRankings(): Promise<KudosRankingDto[]> {
    const kudos = await this.kudosService.getRankings();
    const users = await this.userService.findByUsersName(kudos.map(el => el.name))
    return kudos.map(({name, totalPoints}) => ({
        user: {
          name: name,
          avatar: this.userService.mapAvatarToAvatarDto(name, users)
        },
        totalPoints: Number(totalPoints)
      }
    ));
  }

  @Get('from')
  @ApiResponse({
    status: 200,
    description: 'Kudos `from` overall statistics for months/years',
    type: KudosFromDto,
    isArray: true
  })
  @UseGuards(AuthGuard)
  async kudosFromUsers(): Promise<KudosFromDto[]> {
    const kudos = await this.kudosService.getFrom();
    const users = await this.userService.findByUsersName(kudos.map(el => el.name))
    return kudos.map(({quantity, name, month, year}) =>
      ({
        quantity: Number(quantity), year, from: {
          name: name,
          avatar: this.userService.mapAvatarToAvatarDto(name, users)
        },
        month
      }));
  }

  @Get('given')
  @ApiResponse({
    status: 200,
    description: 'Kudos `given` overall statistics for months/years',
    type: KudosGivenDto,
    isArray: true
  })
  @UseGuards(AuthGuard)
  async kudosGivenToUsers(): Promise<KudosGivenDto[]> {
    const kudos = await this.kudosService.getGiven();
    const users = await this.userService.findByUsersName(kudos.map(el => el.name))
    return kudos.map(({quantity, name, month, year}) => ({
        quantity: Number(quantity), year, givenTo: {
          name: name,
          avatar: this.userService.mapAvatarToAvatarDto(name, users)
        }, month
      })
    );
  }

  @Post('multiKudos')
  @HttpCode(201)
  @UseGuards(SlackTokenGuard)
  @ApiForbiddenResponse({description: 'Forbidden.'})
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Internal endpoint used by /multikudos command from slack',
    type: KudosGivenDto
  })
  async postSlack(@Body() body: PostSlackDto): Promise<{ text: string }> {
    const timeWhenResponseUrlIsAvailable = this.slackService.getSlackResponseDelay()
    const [usersString, description] = body.text.split(';')
    const givenToUsersNames = usersString.replace(/\s+/g, " ").trim().split(' ');
    const [fromUser, givenToUsers] = await Promise.all([this.userService.findByName(body.user_name), this.userService.findByUsersName(givenToUsersNames)]);

    if (!givenToUsers || givenToUsers.length === 0 || !fromUser) {
      this.slackService.responseInvalidUsername(body.response_url, timeWhenResponseUrlIsAvailable)
    } else {
      await this.kudosService.saveKudos(description, fromUser, givenToUsers)
      this.slackService.responseOk(body.response_url, timeWhenResponseUrlIsAvailable);
    }


    return {text: '✅ Thanks for submitting Kudos!'}
  }

  @Post('singleKudos')
  @HttpCode(201)
  @UseGuards(SlackTokenGuard)
  @ApiForbiddenResponse({description: 'Forbidden.'})
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Internal endpoint used by /kudos command from slack',
    type: {}
  })
  async singleKudo(@Body() body: SingleKudosSlackDto): Promise<void> {
    await this.slackService.openSlackDialog(body.trigger_id)
  }

  @Post('slack')
  @HttpCode(201)
  @UseGuards(SlackTokenGuard)
  @ApiForbiddenResponse({description: 'Forbidden.'})
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Internal endpoint used by slack to successfully commit dialog data',
    type: {}
  })
  async saveSingleKudo(@Body() body: DialogPostSlackDto): Promise<void> {
    const payloadBody: PayloadClass = JSON.parse(body.payload);
    const timeWhenResponseUrlIsAvailable = this.slackService.getSlackResponseDelay()

    if (!payloadBody.submission.kudos_given) {
      this.slackService.responseInvalidUsername(payloadBody.response_url, timeWhenResponseUrlIsAvailable)
      return;
    }

    const givenToUser = await this.userService.findUserBySlackId(payloadBody.submission.kudos_given)
    const fromUser = await this.userService.findByName(payloadBody.user.name);

    if (!givenToUser || !fromUser) {
      this.slackService.responseInvalidUsername(payloadBody.response_url, timeWhenResponseUrlIsAvailable)
      return;
    }

    await this.kudosService.saveKudos(
      payloadBody.submission.description,
      fromUser,
      [givenToUser]
    )
    this.slackService.responseOk(payloadBody.response_url, timeWhenResponseUrlIsAvailable);
  }

}
