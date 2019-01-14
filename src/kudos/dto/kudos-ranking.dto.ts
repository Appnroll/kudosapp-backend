import {ApiModelProperty} from "@nestjs/swagger";

export class KudosRankingDto {
    @ApiModelProperty()
    readonly name: string;
    @ApiModelProperty()
    readonly totalPoints: number;
}