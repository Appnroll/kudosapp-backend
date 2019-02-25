import {HttpModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SlackToken} from '../kudos/model/slack-token.entity';
import {User} from '../kudos/model/user.entity';
import {SlackService} from '../kudos/services/slack.service';
import {UserTokenService} from '../kudos/services/user-token.service';
import {UserService} from '../kudos/services/user.service';
import {AvailabilityController} from './controllers/availability.controller';
import {UserPresentEntity} from './model/user-present.entity';
import {SlackHelperService} from "../services/slack-helper.service";
import {ConfigService} from 'nestjs-config';

const SlackOAuthConfigService = {
  provide: 'SlackOAuthConfigService',
  useFactory: (config: ConfigService) => config.get('kudos'),
  inject: [ConfigService],
};

@Module({
  controllers: [AvailabilityController],
  imports: [TypeOrmModule.forFeature([User, UserPresentEntity, SlackToken]), HttpModule],
  providers: [SlackService, UserService, UserTokenService, SlackHelperService, SlackOAuthConfigService],
})
export class AvailabilityModule {
}
