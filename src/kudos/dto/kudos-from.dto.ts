import {ApiModelProperty} from "@nestjs/swagger";
import {UserDto} from "./user.dto";

export class KudosFromDto {
  @ApiModelProperty()
  readonly quantity: number;
  @ApiModelProperty()
  readonly year: number;
  @ApiModelProperty()
  readonly month: string;
  @ApiModelProperty()
  readonly from: UserDto;
}