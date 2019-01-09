import {HttpModule, Module} from '@nestjs/common';
import {KudosController} from './controllers/kudos.controller';
import {KudosService} from './services/kudos.service';
import {Kudos} from "./model/kudos.entity";
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from "./model/user.entity";
import {SlackController} from './controllers/slack.controller';
import {SlackService} from './services/slack.service';
import {UserService} from './services/user.service';

@Module({
    imports: [TypeOrmModule.forFeature([Kudos, User]), HttpModule],
    controllers: [KudosController, SlackController],
    providers: [KudosService, SlackService, UserService]
})
export class KudosModule {
}
