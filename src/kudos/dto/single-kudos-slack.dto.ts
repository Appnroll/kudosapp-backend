import {ApiModelProperty} from "@nestjs/swagger";

export class SingleKudosSlackDto {
  @ApiModelProperty()
  readonly trigger_id: string;

  @ApiModelProperty()
  readonly token: string;

  @ApiModelProperty()
  readonly response_url: string;
}