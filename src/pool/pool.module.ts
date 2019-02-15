import {HttpModule, Module} from '@nestjs/common';
import {PoolController} from './controllers/pool.controller';
import {SlackService} from "../kudos/services/slack.service";
import {UserService} from "../kudos/services/user.service";
import {User} from "../kudos/model/user.entity";
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HttpModule],
  controllers: [PoolController],
  providers: [SlackService, UserService]

})
export class PoolModule {
}
