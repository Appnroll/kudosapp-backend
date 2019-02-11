import {ApiModelProperty} from "@nestjs/swagger";

export class PostSlackDto {
  @ApiModelProperty()
  readonly token: string;
  @ApiModelProperty()
  readonly user_name: string;
  @ApiModelProperty()
  readonly text: string;
  @ApiModelProperty()
  readonly response_url: string;
  @ApiModelProperty()
  readonly trigger_id: string;
}