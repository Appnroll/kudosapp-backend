import {Module} from '@nestjs/common'
import {ConfigService} from './config.service'
import {TypeOrmConfigService} from './type-orm-config.service';

@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(`${process.env.NODE_ENV}.env`),
        },
        TypeOrmConfigService
    ],
    exports: [ConfigService, TypeOrmConfigService],
})
export class ConfigModule {
}
