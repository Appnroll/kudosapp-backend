import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../kudos/model/user.entity';
import { SlackService } from '../kudos/services/slack.service';
import { UserService } from '../kudos/services/user.service';
import { AvailabilityController } from './controllers/availability.controller';
import { UserPresentEntity } from './model/user-present.entity';

@Module({
  controllers: [AvailabilityController],
  imports: [TypeOrmModule.forFeature([User, UserPresentEntity]), HttpModule],
  providers: [SlackService, UserService],
})
export class AvailabilityModule {
}
