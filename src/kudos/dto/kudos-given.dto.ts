import {ApiModelProperty} from "@nestjs/swagger";

export class KudosGivenDto {
    @ApiModelProperty()
    readonly quantity: number;
    @ApiModelProperty()
    readonly year: number;
    @ApiModelProperty()
    readonly month: string;
    @ApiModelProperty()
    readonly givenTo: string;
}