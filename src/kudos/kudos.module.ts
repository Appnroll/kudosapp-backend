import {HttpModule, Module} from '@nestjs/common';
import {UserPresentEntity} from '../availability/model/user-present.entity';
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
import {UserTokenService} from './services/user-token.service';
import {SlackToken} from "./model/slack-token.entity";
import {DateService} from './services/date.service';
import {PollModule} from "../poll/poll.module";
import {SlackHelperService} from "../services/slack-helper.service";

@Module({
  imports: [PollModule, TypeOrmModule.forFeature([Kudos, User, UserKudosEntity, SlackToken, UserPresentEntity]), HttpModule],
  controllers: [KudosController, SlackController, TrelloController],
  providers: [KudosService, SlackService, UserService, TrelloService, UserTokenService, DateService, SlackHelperService]
})
export class KudosModule {
}
