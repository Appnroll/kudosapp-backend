import {ApiModelProperty} from "@nestjs/swagger";

export class PollCreateDto {
  @ApiModelProperty()
  readonly description: string;
  @ApiModelProperty()
  readonly channel_id: string;
  @ApiModelProperty()
  readonly user_id: string;
  @ApiModelProperty()
  readonly user_name: string;
  @ApiModelProperty()
  readonly text: string;
  @ApiModelProperty()
  readonly response_url: string;
  @ApiModelProperty()
  readonly trigger_id: string;
}