import {ApiModelProperty} from "@nestjs/swagger";

interface ActionType {
  id: string
  name: string
  text: string
  type: string
  value: string
  style: string
}

export interface FieldType {
  title: string
  value: string
  short: boolean
}

interface AttachmentData {
  actions: ActionType[]
  fields: FieldType[]
}

export interface PoolAction {
  name: string,
  type: string,
  value: string
}

export interface PoolActionUser {
  name: string,
  id: string
}

export class PoolActionDto {
  @ApiModelProperty()
  readonly user: PoolActionUser
  @ApiModelProperty()
  readonly action_ts: string;
  @ApiModelProperty()
  readonly callback_id: string;
  @ApiModelProperty()
  readonly message_ts: string;
  @ApiModelProperty()
  readonly original_message: { attachments: AttachmentData };
  @ApiModelProperty()
  readonly channel: { name: string, id: string }
  @ApiModelProperty()
  readonly actions: PoolAction


}