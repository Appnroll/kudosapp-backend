import {Body, Controller, Post} from '@nestjs/common';
import {PostSlackDto} from "../../kudos/dto/post-slack.dto";

@Controller('pool')
export class PoolController {

  @Post()
  slackCommand(@Body() body: PostSlackDto){
    console.log(body)
    return {
      "text": "This is your first interactive message",
      "attachments": [
        {
          "text": "Building buttons is easy right?",
          "fallback": "Shame... buttons aren't supported in this land",
          "callback_id": "button_tutorial",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": [
            {
              "name": "yes",
              "text": "yes",
              "type": "button",
              "value": "yes"
            },
            {
              "name": "no",
              "text": "no",
              "type": "button",
              "value": "no"
            },
            {
              "name": "maybe",
              "text": "maybe",
              "type": "button",
              "value": "maybe",
              "style": "danger"
            }
          ]
        }
      ]
    }
  }

}
