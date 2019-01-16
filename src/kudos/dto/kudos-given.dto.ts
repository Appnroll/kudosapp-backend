import {ApiModelProperty} from "@nestjs/swagger";
import {UserDto} from "./user.dto";

export class KudosGivenDto {
    @ApiModelProperty()
    readonly quantity: number;
    @ApiModelProperty()
    readonly year: number;
    @ApiModelProperty()
    readonly month: string;
    @ApiModelProperty()
    readonly givenTo: UserDto;
}