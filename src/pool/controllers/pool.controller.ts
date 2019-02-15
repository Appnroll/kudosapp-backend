import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {PostSlackDto} from "../../kudos/dto/post-slack.dto";
import {PoolCreateDto} from "../dto/pool-create.dto";
import {SlackService} from "../../kudos/services/slack.service";

@Controller('pool')
export class PoolController {

  constructor(private slackService: SlackService) {

  }

  @Post()
  async poolCommand(@Body() body: PoolCreateDto, @Res() res) {
    console.log(body)
    await this.slackService.sendSlackChatMessage(body)
    res.status(HttpStatus.OK).json();
  }

  @Post('action')
  poolAction(@Body() body: PostSlackDto, @Res() res) {
    console.log(body)
    res.status(HttpStatus.OK).json();
  }

}
