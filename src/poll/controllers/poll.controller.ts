import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {PollCreateDto} from "../dto/poll-create.dto";
import {SlackService} from "../../kudos/services/slack.service";
import {DialogPostSlackDto} from "../../kudos/dto/dialog-post-slack.dto";
import {PollActionDto} from "../dto/poll-action.dto";
import {PollData, PollService} from "../services/poll.service";

@Controller('poll')
export class PollController {

  constructor(private slackService: SlackService, private pollService: PollService) {

  }

  @Post()
  async pollCommand(@Body() body: PollCreateDto, @Res() res) {
    const poolBody: PollData = this.pollService.extractPollData(body.text)
    await this.slackService.sendSlackChatMessage(poolBody, body.channel_id)
    res.status(HttpStatus.OK).json();
  }

  @Post('action')
  async pollAction(@Body() body: DialogPostSlackDto, @Res() res) {
    console.log(body)
    const payloadBody: PollActionDto = JSON.parse(body.payload);
    const updatedValues = this.pollService.updateOptionValue(payloadBody.actions[0], payloadBody.original_message.attachments[0].fields, payloadBody.user)
    await this.slackService.updateSlackMessage(payloadBody, updatedValues)
    res.status(HttpStatus.OK).json();
  }

}
