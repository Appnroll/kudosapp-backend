import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {PoolCreateDto} from "../dto/pool-create.dto";
import {SlackService} from "../../kudos/services/slack.service";
import {DialogPostSlackDto} from "../../kudos/dto/dialog-post-slack.dto";
import {PoolActionDto} from "../dto/pool-action.dto";
import {PoolData, PoolService} from "../services/pool.service";

@Controller('pool')
export class PoolController {

  constructor(private slackService: SlackService, private poolService: PoolService) {

  }

  @Post()
  async poolCommand(@Body() body: PoolCreateDto, @Res() res) {
    const poolBody: PoolData = this.poolService.extractPoolData(body.text)
    await this.slackService.sendSlackChatMessage(poolBody, body.channel_id)
    res.status(HttpStatus.OK).json();
  }

  @Post('action')
  async poolAction(@Body() body: DialogPostSlackDto, @Res() res) {
    const payloadBody: PoolActionDto = JSON.parse(body.payload);
    console.log(payloadBody.original_message)
    console.log(payloadBody.original_message.attachments)
    const updatedValues = this.poolService.updateOptionValue(payloadBody.actions, payloadBody.original_message.attachments.fields, payloadBody.user)
    await this.slackService.updateSlackMessage(payloadBody, updatedValues)
    res.status(HttpStatus.OK).json();
  }

}
