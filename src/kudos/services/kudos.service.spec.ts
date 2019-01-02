import { Test, TestingModule } from '@nestjs/testing';
import { KudosService } from './kudos.service';

describe('KudosService', () => {
  let service: KudosService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KudosService],
    }).compile();
    service = module.get<KudosService>(KudosService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
