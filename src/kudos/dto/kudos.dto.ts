import {AvatarDto} from "./avatar.dto";

export class KudosDto {
    readonly id: number;
    readonly from: string;
    readonly givenTo: string;
    readonly description: string;
    readonly fromAvatar?: AvatarDto
    readonly givenToAvatar?: AvatarDto
}