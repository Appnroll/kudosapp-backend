import {AvatarDto} from "./avatar.dto";
import {ApiModelProperty} from "@nestjs/swagger";

export class KudosDto {
    @ApiModelProperty()
    readonly id: number;
    @ApiModelProperty()
    readonly from: string;
    @ApiModelProperty({ type: [String] })
    readonly givenTo: string[];
    @ApiModelProperty()
    readonly description: string;
    @ApiModelProperty()
    readonly fromAvatar?: AvatarDto
    @ApiModelProperty({ type: [AvatarDto] })
    readonly givenToAvatar?: AvatarDto[]
}