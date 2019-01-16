import {ApiModelProperty} from "@nestjs/swagger";
import {UserDto} from "./user.dto";

export class KudosDto {
    @ApiModelProperty()
    readonly id: number;
    @ApiModelProperty()
    readonly from: UserDto;
    @ApiModelProperty({type: [UserDto]})
    readonly givenTo: UserDto[];
    @ApiModelProperty()
    readonly description: string;
}