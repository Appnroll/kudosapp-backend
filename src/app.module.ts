import {Module} from '@nestjs/common';
import {KudosModule} from './kudos/kudos.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from "nestjs-config";
import {AvailabilityModule} from './availability/availability.module';
import {PollModule} from './poll/poll.module';
import {SlackHelperService} from './services/slack-helper.service';
import * as path from 'path';

const pathToConfiguration = process.env.NODE_ENV == 'production' ? 'config/**/*.js' : 'config/**/*.{ts,js}';

@Module({
  imports: [
    KudosModule,
    ConfigModule.load(path.resolve(__dirname, pathToConfiguration)),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    AvailabilityModule,
    PollModule
  ],
  providers: [SlackHelperService],
})
export class AppModule {
}
