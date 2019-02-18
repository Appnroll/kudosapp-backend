import {HttpModule, Module} from '@nestjs/common';
import {PoolController} from './controllers/pool.controller';
import {SlackService} from "../kudos/services/slack.service";
import {UserService} from "../kudos/services/user.service";
import {User} from "../kudos/model/user.entity";
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserPresentEntity} from "../availability/model/user-present.entity";
import { PollService } from './services/poll.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPresentEntity]), HttpModule],
  controllers: [PoolController],
  providers: [SlackService, UserService, PollService]

})
export class PoolModule {
}
