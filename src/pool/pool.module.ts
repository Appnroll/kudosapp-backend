import { Module } from '@nestjs/common';
import { PoolController } from './controllers/pool.controller';

@Module({
  controllers: [PoolController]
})
export class PoolModule {}
