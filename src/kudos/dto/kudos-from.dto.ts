import {ApiModelProperty} from "@nestjs/swagger";

export class KudosFromDto {
    @ApiModelProperty()
    readonly quantity: number;
    @ApiModelProperty()
    readonly year: number;
    @ApiModelProperty()
    readonly month: string;
    @ApiModelProperty()
    readonly from: string;
}