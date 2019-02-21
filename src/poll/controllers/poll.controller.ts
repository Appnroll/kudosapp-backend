import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {PollCreateDto} from "../dto/poll-create.dto";
import {SlackService} from "../../kudos/services/slack.service";
import {DialogPostSlackDto} from "../../kudos/dto/dialog-post-slack.dto";
import {PollActionDto} from "../dto/poll-action.dto";
import {PollService} from "../services/poll.service";
import {SLACK_ACTION_TYPES} from "../../services/slack-helper.service";

@Controller('poll')
export class PollController {

  constructor(private slackService: SlackService, private pollService: PollService) {
  }

  @Post()
  async pollCommand(@Body() body: PollCreateDto, @Res() res) {
    // const poolBody: PollData = this.pollService.extractPollData(body.text)
    // await this.pollService.sendSlackChatMessage(poolBody, body.channel_id)
    await this.pollService.openPollDialog(body.trigger_id)
    res.status(HttpStatus.OK).json();
  }

  @Post('action')
  async pollAction(@Body() body: DialogPostSlackDto, @Res() res) {
    console.log(body)
    const payloadBody: PollActionDto = JSON.parse(body.payload);
    const actionType = payloadBody.callback_id;

    switch (actionType) {
      case SLACK_ACTION_TYPES.POLL_OPEN_DIALOG: {
        // await this.pollService.updateSlackMessage()
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
