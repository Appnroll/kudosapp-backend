import {ApiModelProperty} from "@nestjs/swagger";

export class DialogPostSlackDto {
    @ApiModelProperty()
    readonly payload: string;
}

export class PayloadClass {
    @ApiModelProperty()
    readonly user: { id: string, name: string }
    @ApiModelProperty()
    readonly submission: { kudos_given: string, description: string }
    @ApiModelProperty()
    readonly response_url: string
    @ApiModelProperty()
    readonly token: string

}
