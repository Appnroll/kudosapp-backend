import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { SlackTokenGuard } from '../../guards/slackToken.guard';
import { DialogPostSlackDto, PayloadClass } from '../dto/dialog-post-slack.dto';
import { KudosFromDto } from '../dto/kudos-from.dto';
import { KudosGivenDto } from '../dto/kudos-given.dto';
import { KudosRankingDto } from '../dto/kudos-ranking.dto';
import { KudosDto } from '../dto/kudos.dto';
import { PageDto } from '../dto/page.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { PostSlackDto } from '../dto/post-slack.dto';
import { SingleKudosSlackDto } from '../dto/single-kudos-slack.dto';
import { KudosService } from '../services/kudos.service';
import { SlackService } from '../services/slack.service';
import { UserService } from '../services/user.service';
import {SlackHelperService} from "../../services/slack-helper.service";

@Controller('kudos')
@ApiUseTags('kudos')
export class KudosController {

  constructor(private readonly kudosService: KudosService,
              private readonly userService: UserService,
              private readonly slackHelperService: SlackHelperService,
              private readonly slackService: SlackService) {
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Get all Kudos', type: PageDto })
  async getKudos(@Query('page') page: number = 0, @Query('size') size: number = 25): Promise<PageDto<KudosDto>> {
    const pagination: PaginationDto = { page, size };
    return await this.kudosService.getAllPaginated(pagination);
  }

  @Get('rankings')
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: 'Get overall rankings', type: KudosRankingDto, isArray: true })
  async getRankings(): Promise<KudosRankingDto[]> {
    const kudos = await this.kudosService.getRankings();
    const users = await this.userService.findByUsersName(kudos.map(el => el.name));
    return kudos.map(({ name, totalPoints }) => ({
        user: {
          name,
          avatar: this.userService.mapAvatarToAvatarDto(name, users),
          available: false,
        },
        totalPoints: Number(totalPoints),
      }
    ));
  }

  @Get('from')
  @ApiResponse({
    status: 200,
    description: 'Kudos `from` overall statistics for months/years',
    type: KudosFromDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  async kudosFromUsers(): Promise<KudosFromDto[]> {
    const kudos = await this.kudosService.getFromAll();
    const users = await this.userService.findByUsersName(kudos.map(el => el.name));
    return kudos.map(({ quantity, name, month, year }) =>
      ({
        quantity: Number(quantity), year, from: {
          name,
          avatar: this.userService.mapAvatarToAvatarDto(name, users),
          available: false,
        },
        month,
      }));
  }

  @Get('from/:year/:month')
  @ApiResponse({
    status: 200,
    description: 'Kudos `from` statistics for month/year',
    type: KudosFromDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  async kudosFromYearMonthSpecific(@Param('year') year, @Param('month') month): Promise<KudosFromDto[]> {
    const kudos = await this.kudosService.getFrom(year, month);
    const users = await this.userService.findByUsersName(kudos.map(el => el.name));
    return kudos.map(({ quantity, name, month, year }) =>
      ({
        quantity: Number(quantity), year, from: {
          name,
          avatar: this.userService.mapAvatarToAvatarDto(name, users),
          available: false,
        },
        month,
      }));
  }

  @Get('given/:year/:month')
  @ApiResponse({
    status: 200,
    description: 'Kudos `given` for month/year',
    type: KudosGivenDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  async kudosGivenYearMonthSpecific(@Param('year') year, @Param('month') month): Promise<KudosGivenDto[]> {
    const kudos = await this.kudosService.getGiven(year, month);
    const users = await this.userService.findByUsersName(kudos.map(el => el.name));
    return kudos.map(({ quantity, name, month, year }) => ({
        quantity: Number(quantity), year, givenTo: {
          name,
          avatar: this.userService.mapAvatarToAvatarDto(name, users),
          available: false,
        }, month,
      }),
    );
  }

  @Get('given')
  @ApiResponse({
    status: 200,
    description: 'Kudos `given` overall statistics for months/years',
    type: KudosGivenDto,
    isArray: true,
  })
  @UseGuards(AuthGuard)
  async kudosGivenToUsers(): Promise<KudosGivenDto[]> {
    const kudos = await this.kudosService.getGivenAll();
    const users = await this.userService.findByUsersName(kudos.map(el => el.name));
    return kudos.map(({ quantity, name, month, year }) => ({
        quantity: Number(quantity), year, givenTo: {
          name,
          avatar: this.userService.mapAvatarToAvatarDto(name, users),
          available: false,
        }, month,
      }),
    )
      ;
  }

  @Post('multiKudos')
  @HttpCode(201)
  @UseGuards(SlackTokenGuard)
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Internal endpoint used by /multikudos command from slack',
    type: KudosGivenDto,
  })
  async postSlack(@Body() body: PostSlackDto): Promise<{ text: string }> {
    const timeWhenResponseUrlIsAvailable = this.slackHelperService.getSlackResponseDelay();
    const [usersString, description] = body.text.split(';');
    const givenToUsersNames = usersString.replace(/\s+/g, ' ').trim().split(' ');
    const [fromUser, givenToUsers] = await Promise.all([this.userService.findByName(body.user_name), this.userService.findByUsersName(givenToUsersNames)]);

    if (!givenToUsers || givenToUsers.length === 0 || !fromUser) {
      this.slackHelperService.responseInvalidUsername(body.response_url, timeWhenResponseUrlIsAvailable);
    } else {
      await this.kudosService.saveKudos(description, fromUser, givenToUsers);
      this.slackHelperService.responseOk(body.response_url, timeWhenResponseUrlIsAvailable);
    }
    return { text: '✅ Thanks for submitting Kudos!' };
  }

  @Post('singleKudos')
  @HttpCode(201)
  @UseGuards(SlackTokenGuard)
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Internal endpoint used by /kudos command from slack',
    type: {},
  })
  async singleKudo(@Body() body: SingleKudosSlackDto): Promise<void> {
    await this.slackService.openSlackDialog(body.trigger_id);
  }

  @Post('slack')
  @HttpCode(201)
  @UseGuards(SlackTokenGuard)
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Internal endpoint used by slack to successfully commit dialog data',
    type: {},
  })
  async saveSingleKudo(@Body() body: DialogPostSlackDto): Promise<void> {
    const payloadBody: PayloadClass = JSON.parse(body.payload);
    const timeWhenResponseUrlIsAvailable = this.slackHelperService.getSlackResponseDelay();

    if (!payloadBody.submission.kudos_given) {
      this.slackHelperService.responseInvalidUsername(payloadBody.response_url, timeWhenResponseUrlIsAvailable);
      return;
    }

    const givenToUser = await this.userService.findUserBySlackId(payloadBody.submission.kudos_given);
    const fromUser = await this.userService.findByName(payloadBody.user.name);

    if (!givenToUser || !fromUser) {
      this.slackHelperService.responseInvalidUsername(payloadBody.response_url, timeWhenResponseUrlIsAvailable);
      return;
    }

    await this.kudosService.saveKudos(
      payloadBody.submission.description,
      fromUser,
      [givenToUser],
    );
    this.slackHelperService.responseOk(payloadBody.response_url, timeWhenResponseUrlIsAvailable);
  }

}
