import {HttpModule, Module} from '@nestjs/common';
import {KudosController} from './controllers/kudos.controller';
import {KudosService} from './services/kudos.service';
import {Kudos} from "./model/kudos.entity";
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from "./model/user.entity";
import {SlackController} from './controllers/slack.controller';
import {SlackService} from './services/slack.service';
import {UserService} from './services/user.service';
import {UserKudosEntity} from "./model/user-kudos.entity";
import {TrelloService} from './services/trello.service';
import {TrelloController} from './controllers/trello.controller';
import { UserTokenService } from './services/user-token.service';
import {SlackToken} from "./model/slack-token.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Kudos, User, UserKudosEntity, SlackToken]), HttpModule],
    controllers: [KudosController, SlackController, TrelloController],
    providers: [KudosService, SlackService, UserService, TrelloService, UserTokenService]
})
export class KudosModule {
}
