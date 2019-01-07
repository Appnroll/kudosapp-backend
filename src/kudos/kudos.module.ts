import {HttpModule, Module} from '@nestjs/common';
import {KudosController} from './controllers/kudos.controller';
import {KudosService} from './services/kudos.service';
import {Kudos} from "./model/kudos.entity";
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Kudos]), HttpModule],
    controllers: [KudosController],
    providers: [KudosService]
})
export class KudosModule {
}
