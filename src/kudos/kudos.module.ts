import { Module } from '@nestjs/common';
import { KudosController } from './controllers/kudos.controller';
import { KudosService } from './services/kudos.service';

@Module({
  controllers: [KudosController],
  providers: [KudosService]
})
export class KudosModule {}
