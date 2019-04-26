import {ApiModelProperty} from "@nestjs/swagger";

export class PollTriggerDto {
  @ApiModelProperty()
  readonly trigger_id: string;
}