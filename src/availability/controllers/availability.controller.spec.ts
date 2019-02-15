import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityController } from './availability.controller';

describe('Availability Controller', () => {
  let controller: AvailabilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityController],
    }).compile();

    controller = module.get<AvailabilityController>(AvailabilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
