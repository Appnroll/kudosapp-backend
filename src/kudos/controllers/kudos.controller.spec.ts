import { Test, TestingModule } from '@nestjs/testing';
import { KudosController } from './kudos.controller';

describe('KudosEntity Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [KudosController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: KudosController = module.get<KudosController>(KudosController);
    expect(controller).toBeDefined();
  });
});
