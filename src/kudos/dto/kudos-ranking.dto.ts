import {ApiModelProperty} from "@nestjs/swagger";
import {UserDto} from "./user.dto";

export class KudosRankingDto {
  @ApiModelProperty()
  readonly user: UserDto;
  @ApiModelProperty()
  readonly totalPoints: number;
}