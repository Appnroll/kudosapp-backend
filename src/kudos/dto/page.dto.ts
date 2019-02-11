import {ApiModelProperty} from "@nestjs/swagger";

export class PageDto<T> {
  @ApiModelProperty()
  data: T[];
  @ApiModelProperty()
  readonly page: number;
  @ApiModelProperty()
  readonly size: number;
  @ApiModelProperty()
  readonly hasNext: boolean;
}