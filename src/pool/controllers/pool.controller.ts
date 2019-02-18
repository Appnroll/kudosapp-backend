import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {PostSlackDto} from "../../kudos/dto/post-slack.dto";
import {PoolCreateDto} from "../dto/pool-create.dto";
import {SlackService} from "../../kudos/services/slack.service";
import {DialogPostSlackDto, PayloadClass} from "../../kudos/dto/dialog-post-slack.dto";
import {PoolActionDto} from "../dto/pool-action.dto";

@Controller('pool')
export class PoolController {

  constructor(private slackService: SlackService) {

  }

  @Post()
  async poolCommand(@Body() body: PoolCreateDto, @Res() res) {
    await this.slackService.sendSlackChatMessage(body)
    res.status(HttpStatus.OK).json();
  }

  @Post('action')
  poolAction(@Body() body: DialogPostSlackDto, @Res() res) {
    const payloadBody: PoolActionDto = JSON.parse(body.payload);

    console.log(body)
    res.status(HttpStatus.OK).json();
  }

}
