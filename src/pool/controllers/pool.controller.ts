import {Body, Controller, Post} from '@nestjs/common';
import {PostSlackDto} from "../../kudos/dto/post-slack.dto";

@Controller('pool')
export class PoolController {

  @Post()
  slackCommand(@Body() body: PostSlackDto){
    console.log(body)
    return {text: '✅ Thanks for submitting Kudos!'}
  }

}
