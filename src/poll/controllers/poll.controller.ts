import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {PollCreateDto} from "../dto/poll-create.dto";
import {SlackService} from "../../kudos/services/slack.service";
import {SlackActionDto} from "../../kudos/dto/slack-action.dto";
import {CreatePollActionDto, UpdateMessageActionDto} from "../dto/poll-action.dto";
import {PollData, PollService} from "../services/poll.service";
import {SLACK_ACTION_TYPES} from "../../services/slack-helper.service";
import {PollTriggerDto} from "../dto/poll-trigger.dto";

@Controller('poll')
export class PollController {

  constructor(private slackService: SlackService, private pollService: PollService) {
  }

  @Post()
  async pollCommand(@Body() body: PollTriggerDto, @Res() res) {
    await this.pollService.openPollDialog(body.trigger_id)
    res.status(HttpStatus.OK).json();
  }

  @Post('multiPoll')
  async multiPoll(@Body() body: PollCreateDto, @Res() res) {
    const pollBody: PollData = this.pollService.extractPollData(body.text)
    await this.pollService.sendSlackChatMessage(pollBody, body.channel_id)
    res.status(HttpStatus.OK).json();
  }

  @Post('action')
  async pollAction(@Body() body: SlackActionDto, @Res() res) {
    console.log(body)
    const payloadBody: any = body.payload
    const actionType = payloadBody.callback_id;

    switch (actionType) {
      case SLACK_ACTION_TYPES.POLL_OPEN_DIALOG: {
        const pollBody: PollData = this.pollService.extractPollDataFromDialog(payloadBody)
        await this.pollService.sendSlackChatMessage(pollBody, payloadBody.channel.id)
        break;
      }
      case SLACK_ACTION_TYPES.POLL_ANSWER: {
        const updatedValues = this.pollService.updateOptionValue(payloadBody.actions[0], payloadBody.original_message.attachments[0].fields, payloadBody.user)
        await this.pollService.updateSlackMessage(payloadBody, updatedValues)
        break;
      }
    }
    res.status(HttpStatus.OK).json();
  }

}
