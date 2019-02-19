import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {PostSlackDto} from "../../kudos/dto/post-slack.dto";
import {PoolCreateDto} from "../dto/pool-create.dto";
import {SlackService} from "../../kudos/services/slack.service";
import {DialogPostSlackDto, PayloadClass} from "../../kudos/dto/dialog-post-slack.dto";
import {PoolActionDto} from "../dto/pool-action.dto";
import {PoolData, PoolService} from "../services/pool.service";

@Controller('pool')
export class PoolController {

  constructor(private slackService: SlackService, private poolSerivce: PoolService) {

  }

  @Post()
  async poolCommand(@Body() body: PoolCreateDto, @Res() res) {
    const poolBody: PoolData = this.poolSerivce.extractPoolData(body.text)
    await this.slackService.sendSlackChatMessage(poolBody, body.channel_id)
    res.status(HttpStatus.OK).json();
  }

  @Post('action')
  async poolAction(@Body() body: DialogPostSlackDto, @Res() res) {
    const payloadBody: PoolActionDto = JSON.parse(body.payload);
    await this.slackService.updateSlackMessage(payloadBody)

    console.log(body)
    res.status(HttpStatus.OK).json();
  }

}
