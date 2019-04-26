import {HttpModule, Module} from '@nestjs/common';
import {PollController} from './controllers/poll.controller';
import {SlackService} from "../kudos/services/slack.service";
import {UserService} from "../kudos/services/user.service";
import {User} from "../kudos/model/user.entity";
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserPresentEntity} from "../availability/model/user-present.entity";
import {PollService} from './services/poll.service';
import {SlackHelperService} from "../services/slack-helper.service";
import {ConfigService} from 'nestjs-config';
import {SlackAuthService} from "../services/slack-auth.service";

const SlackOAuthConfigService = {
  provide: 'SlackOAuthConfigService',
  useFactory: (config: ConfigService) => config.get('poll'),
  inject: [ConfigService],
};

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPresentEntity]), HttpModule],
  controllers: [PollController],
  providers: [
    SlackService,
    UserService,
    PollService,
    SlackHelperService,
    SlackOAuthConfigService,
    SlackAuthService
  ],
  exports: [PollService]
})
export class PollModule {
}
