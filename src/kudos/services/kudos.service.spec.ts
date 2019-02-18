import {Test, TestingModule} from '@nestjs/testing';
import {KudosService} from './kudos.service';
import {HttpModule} from "@nestjs/common";
import {Repository} from "typeorm";
import {Kudos} from "../model/kudos.entity";

describe('KudosService', () => {
  let service: KudosService;
  let kudosRepository: Repository<Kudos>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        KudosService,
      ],
    }).compile();
    service = module.get<KudosService>(KudosService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
