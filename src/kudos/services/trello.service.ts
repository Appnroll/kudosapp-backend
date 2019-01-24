import {Injectable, HttpService} from '@nestjs/common';
import * as TrelloNodeAPI from 'trello-node-api';
import {InjectConfig} from 'nestjs-config';
import {UserService} from "./user.service";
import {map} from "rxjs/operators";
import {KudosService} from "./kudos.service";

interface TrelloSlackUser {
    trelloUserName: string,
    slackId: string
}

interface TrelloUser {
    id: string,
    username: string,
    fullName: string
}

interface TrelloAction {
    date: string,
    type: string,
    memberCreator: {
        username: string
    }
}

interface TrelloCard {
    name: string
    idMembers: string[]
    id: string
    shortLink: string
}


@Injectable()
export class TrelloService {

    private trelloKey: string;
    private trelloToken: string;
    private trelloBoardId: string;
    private trelloApi: TrelloNodeAPI;

    constructor(@InjectConfig() private readonly config,
                private httpService: HttpService,
                private userService: UserService,
                private kudosService: KudosService
    ) {
        this.trelloApi = new TrelloNodeAPI();
        this.trelloApi.setApiKey(this.config.get('trello').trelloKey);
        this.trelloApi.setOauthToken(this.config.get('trello').trelloToken);
        this.trelloKey = this.config.get('trello').trelloKey;
        this.trelloToken = this.config.get('trello').trelloToken;
        this.trelloBoardId = this.config.get('trello').trelloKudosBoardId;
    }

    async fetchCards() {
        const cards: TrelloCard[] = await this.trelloApi.board.searchCards(this.config.get('trello').trelloKudosBoardId);

        cards.forEach(async (el, index) => {
            setTimeout(async () => {
                if (el.idMembers.length == 0) return;

                const givenToUsers = await this.userService.findAllByTrelloId(el.idMembers);
                const actions: TrelloAction[] = await this.httpService
                    .get<TrelloAction[]>(`https://api.trello.com/1/cards/${el.shortLink}/actions?key=${this.trelloKey}&token=${this.trelloToken}&filter=createCard`)
                    .pipe(map(response => response.data))
                    .toPromise()

                if (actions.length == 0 || givenToUsers.length == 0) {
                    return;
                }

                const createAction = actions.shift();
                const fromUser = await this.userService.findAllByTrelloName([createAction.memberCreator.username]);

                await this.kudosService.saveKudos(el.name, fromUser[0], givenToUsers, new Date(createAction.date))

                console.log(`saved number: ${index} / ${cards.length}`)
            }, index * 500)
        })
    }

    async saveTrelloUsers() {
        const users: TrelloUser[] = await this.httpService
            .get<TrelloUser[]>(`https://api.trello.com/1/boards/${this.trelloBoardId}/members?key=${this.trelloKey}&token=${this.trelloToken}`)
            .pipe(map(response => response.data))
            .toPromise()
        await this.matchUsersToCurrentSlackUsers(users);
    }

    private async matchUsersToCurrentSlackUsers(trelloUsers: TrelloUser[]) {
        const currentUsers = await this.userService.findAll();
        trelloUsers.forEach(({id, username}) => {
            const {slackId} = this.USERS_SLACK_TRELLO_MAP.find(({trelloUserName}) => trelloUserName == username)
            const user = currentUsers.find(({slackId: userSlackId}) => slackId == userSlackId);
            user.trelloId = id
            user.trelloName = username
        });
        await this.userService.saveUsers(currentUsers);
    }

    private USERS_SLACK_TRELLO_MAP = [
        {slackId: 'UF5NBJ9E3', trelloUserName: 'karolwozniak5'} as TrelloSlackUser,
        {slackId: 'U8M222HRS', trelloUserName: 'gosia581'} as TrelloSlackUser,
        {slackId: 'UF2AGSQFL', trelloUserName: 'wojciechwasiluk2'} as TrelloSlackUser,
        {slackId: 'U4EPDCS87', trelloUserName: 'natalia79337838'} as TrelloSlackUser,
        {slackId: 'U1AGSBFGF', trelloUserName: 'mkurczewski'} as TrelloSlackUser,
        {slackId: 'UB8QGNTT3', trelloUserName: 'ernestmiller3'} as TrelloSlackUser,
        {slackId: 'U0N8TBT47', trelloUserName: 'dotaappnrollcom'} as TrelloSlackUser,
        {slackId: 'UAC4SRNJ1', trelloUserName: 'adriankrupowicz1'} as TrelloSlackUser,
        {slackId: 'UEFUJ688K', trelloUserName: 'aleksandramikusek'} as TrelloSlackUser,
        {slackId: 'UFLSLV5C5', trelloUserName: 'annapetrovych'} as TrelloSlackUser,
        {slackId: 'U9FPA7K0F', trelloUserName: 'bartekpichalski1'} as TrelloSlackUser,
        {slackId: 'U7MASLR52', trelloUserName: 'dariavengeresh'} as TrelloSlackUser,
        {slackId: 'U9ZK9FWKB', trelloUserName: 'dominikkorolczuk2'} as TrelloSlackUser,
        {slackId: 'U923URFMG', trelloUserName: 'dorotakokosinska1'} as TrelloSlackUser,
        {slackId: 'U9RBUS4KS', trelloUserName: 'malgo_plichta'} as TrelloSlackUser,
        {slackId: 'U0DG2ALDU', trelloUserName: 'jakub307'} as TrelloSlackUser,
        {slackId: 'UA4AHJ78B', trelloUserName: 'ktraczyk1'} as TrelloSlackUser,
        {slackId: 'U09HFDFJN', trelloUserName: 'kamilggajowy'} as TrelloSlackUser,
        {slackId: 'U8SNAH9L0', trelloUserName: 'kasiabochenska5'} as TrelloSlackUser,
        {slackId: 'UA4AHJ78B', trelloUserName: 'konradtraczyk6'} as TrelloSlackUser,
        {slackId: 'U9HUN6B4Z', trelloUserName: 'lukaszmeyer1'} as TrelloSlackUser,
        {slackId: 'UBNEZAUH0', trelloUserName: 'mchiaradia3'} as TrelloSlackUser,
        {slackId: 'U7TTX5YAY', trelloUserName: 'mpiesta1'} as TrelloSlackUser,
        {slackId: 'U3KLEEWM6', trelloUserName: 'mateuszkocz'} as TrelloSlackUser,
        {slackId: 'U8A0ZB3M4', trelloUserName: 'michajarosz9'} as TrelloSlackUser,
        {slackId: 'U7B7XJR5X', trelloUserName: 'ola847'} as TrelloSlackUser,
        {slackId: 'UAP1FJFRR', trelloUserName: 'piotrpaulski3'} as TrelloSlackUser,
        {slackId: 'UAP1FJFRR', trelloUserName: 'piotrpaulski2'} as TrelloSlackUser,
        {slackId: 'U9ZEV2SC8', trelloUserName: 'piotrzientara4'} as TrelloSlackUser,
        {slackId: 'U9ZTKRH9S', trelloUserName: 'robertborzecki1'} as TrelloSlackUser,
        {slackId: 'U0MU47DK9', trelloUserName: 'tiffanyhoran'} as TrelloSlackUser,
        {slackId: 'U09HLQ70C', trelloUserName: 'tomasznosal1'} as TrelloSlackUser,
        {slackId: 'UA1U5CJ1M', trelloUserName: 'tomaszwozniak17'} as TrelloSlackUser,
        {slackId: 'UB4HJM941', trelloUserName: 'ulabieniecka1'} as TrelloSlackUser,
        {slackId: 'U7CAY2X2P', trelloUserName: 'urszulakamierczyk'} as TrelloSlackUser,
        {slackId: 'U0X7QL9F0', trelloUserName: 'mdabrowski3'} as TrelloSlackUser,
        {slackId: 'UC0KQ87D1', trelloUserName: 'mishkaaa'} as TrelloSlackUser,
        {slackId: 'U09HDA1RN', trelloUserName: 'ukaszanwajler'} as TrelloSlackUser,
        {slackId: 'U2K0J85DX', trelloUserName: 'lukaszborawski'} as TrelloSlackUser,
        {slackId: 'U6WE42QKE', trelloUserName: 'ukaszskrzypczak1'} as TrelloSlackUser,
    ]

}
