import {Module} from '@nestjs/common';
import {KudosModule} from './kudos/kudos.module';
import {ConfigModule} from "./config/config.module";
import {TypeOrmModule} from '@nestjs/typeorm';
import {TypeOrmConfigService} from "./config/type-orm-config.service";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        KudosModule,
        ConfigModule
    ],
    providers: [],
})
export class AppModule {
}
