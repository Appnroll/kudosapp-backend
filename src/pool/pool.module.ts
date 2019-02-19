import {HttpModule, Module} from '@nestjs/common';
import {PoolController} from './controllers/pool.controller';
import {SlackService} from "../kudos/services/slack.service";
import {UserService} from "../kudos/services/user.service";
import {User} from "../kudos/model/user.entity";
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserPresentEntity} from "../availability/model/user-present.entity";
import {PoolService} from './services/pool.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPresentEntity]), HttpModule],
  controllers: [PoolController],
  providers: [SlackService, UserService, PoolService],
  exports: [PoolService]
})
export class PoolModule {
}
