import {ApiModelProperty} from "@nestjs/swagger";

export class AvatarDto {
    @ApiModelProperty()
    readonly image_24: string;

    @ApiModelProperty()
    readonly image_32: string;

    @ApiModelProperty()
    readonly image_48: string;

    @ApiModelProperty()
    readonly image_72: string;

    @ApiModelProperty()
    readonly image_192: string;
}