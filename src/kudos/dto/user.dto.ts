import {ApiModelProperty} from "@nestjs/swagger";
import {AvatarDto} from "./avatar.dto";

export class UserDto {
  @ApiModelProperty()
  readonly name: string;
  @ApiModelProperty()
  readonly avatar: AvatarDto;
  @ApiModelProperty()
  readonly available: boolean;
}